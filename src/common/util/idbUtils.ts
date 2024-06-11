import type { StateStorage } from 'zustand/middleware';
import { del as idbDel, get as idbGet, set as idbSet } from 'idb-keyval';

// Set to true to enable debugging
const DEBUG_SCHEDULER = false;
const USER_LOG_ISSUES = true;

interface PendingWrite {
  timeoutId: NodeJS.Timeout | null;
  firstAttemptTime: number;
  pendingValue: string | null;
}

class WriteScheduler {
  private writeOperations: Record<string, PendingWrite> = {};

  constructor(
    private readonly maxDeadline: number = 600,
    private readonly minInterval: number = 250
  ) {}

  scheduleWrite(key: string, value: string): void {
    const now = Date.now();
    const operation = this.writeOperations[key] || {
      timeoutId: null,
      firstAttemptTime: now,
      pendingValue: null,
    };

    if (operation.timeoutId !== null) {
      clearTimeout(operation.timeoutId);
      operation.timeoutId = null;
    }

    if (!operation.firstAttemptTime) {
      operation.firstAttemptTime = now;
    }
    operation.pendingValue = value;
    this.writeOperations[key] = operation;

    const timeSinceFirstAttempt = now - operation.firstAttemptTime;
    let writeDelay = this.minInterval;

    if (timeSinceFirstAttempt + this.minInterval > this.maxDeadline) {
      writeDelay = this.maxDeadline - timeSinceFirstAttempt;
    }

    if (writeDelay < 10) {
      this.performWrite(key).catch((error) => {
        if (USER_LOG_ISSUES) {
          console.warn('idbUtils: E1: writing', key, error);
        }
      });
    } else {
      operation.timeoutId = setTimeout(() => {
        this.performWrite(key).catch((error) => {
          if (USER_LOG_ISSUES) {
            console.warn('idbUtils: E2: writing', key, error);
          }
        });
      }, writeDelay);
    }
  }

  async performWrite(key: string): Promise<void> {
    const operation = this.writeOperations[key];
    if (!operation) {
      if (USER_LOG_ISSUES) {
        console.warn('idbUtils: write operation not found for', key);
      }
      return;
    }
    const valueToWrite = operation.pendingValue;
    operation.timeoutId = null;
    operation.firstAttemptTime = 0;
    operation.pendingValue = null;

    if (valueToWrite === null) {
      if (USER_LOG_ISSUES) {
        console.warn('idbUtils: write operation has no pending value for', key);
      }
    } else {
      const start = Date.now();

      if (DEBUG_SCHEDULER) {
        console.log(' - idb: [SET]', key);
      }

      await idbSet(key, valueToWrite);

      if (DEBUG_SCHEDULER) {
        console.warn(
          '   (write time:',
          Date.now() - start,
          'ms, bytes:',
          valueToWrite.length.toLocaleString(),
          ')'
        );
      }
    }
  }

  async retrievePendingWrite(key: string): Promise<string | null> {
    const operation = this.writeOperations[key];
    if (operation && operation.pendingValue !== null) {
      return operation.pendingValue;
    }

    return null;
  }
}

const writeScheduler = new WriteScheduler(1000, 400);

/**
 * A Zustand state storage implementation that uses IndexedDB as a simple key-value store
 */
export const idbStateStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const pendingValue = await writeScheduler.retrievePendingWrite(name);
    if (pendingValue !== null) {
      return pendingValue;
    }

    const value: string | undefined = await idbGet(name);

    return value || null;
  },
  setItem: (name: string, value: string): void => {
    writeScheduler.scheduleWrite(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await idbDel(name);
  },
};
