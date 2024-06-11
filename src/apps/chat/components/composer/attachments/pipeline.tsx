import { callBrowseFetchPage } from '~/modules/browse/browse.client';
import { createBase36Uid } from '~/common/util/textUtils';
import { htmlTableToMarkdown } from '~/common/util/htmlTableToMarkdown';
import { pdfToImageDataURLs, pdfToText } from '~/common/util/pdfUtils';

type AttachmentConverter = {
  id: string;
  name: string;
  disabled?: boolean;
  unsupported?: boolean;
};

const PLAIN_TEXT_EXTENSIONS = ['.ts', '.tsx'];
const PLAIN_TEXT_MIMETYPES = [
  'text/plain',
  'text/html',
  'text/markdown',
  'text/csv',
  'text/css',
  'text/javascript',
  'application/json',
];

/**
 * Creates a new Attachment object.
 */
export function attachmentCreate(
  source: AttachmentSource,
  checkDuplicates: AttachmentId[]
): Attachment {
  return {
    id: createBase36Uid(checkDuplicates),
    source: source,
    label: 'Loading...',
    ref: '',
    inputLoading: false,
    inputError: null,
    input: undefined,
    converters: [],
    converterIdx: null,
    outputsConverting: false,
    outputs: [],
    // metadata: {},
  };
}

/**
 * Asynchronously loads the input for an Attachment object.
 *
 * @param source - The source of the attachment.
 * @param edit - A function to edit the Attachment object.
 */
export async function attachmentLoadInputAsync(
  source: AttachmentSource,
  edit: (changes: Partial<Attachment>) => void
) {
  edit({ inputLoading: true });

  switch (source.media) {
    case 'url':
      // ...
      break;
    case 'file':
      // ...
      break;
    case 'text':
      // ...
      break;
    case 'ego':
      // ...
      break;
  }

  edit({ inputLoading: false });
}

/**
 * Defines the possible converters for an Attachment object based on its input type.
 *
 * @param sourceType - The media type of the attachment source.
 * @param input - The input of the attachment.
 * @param edit - A function to edit the Attachment object.
 */
export function attachmentDefineConverters(
  sourceType: AttachmentSource['media'],
  input: AttachmentInput,
  edit: (changes: Partial<Attachment>) => void
) {
  // ...
}

/**
 * Converts the input of an Attachment object based on the selected converter.
 *
 * @param attachment - The Attachment object to convert.
 * @param converterIdx - The index of the selected conversion in the Attachment object's converters array.
 * @param edit - A function to edit the Attachment object.
 */
export async function attachmentPerformConversion(
  attachment: Attachment,
  converterIdx: number | null,
  edit: (changes: Partial<Attachment>) => void
) {
  // ...
}
