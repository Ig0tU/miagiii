import { DLLMId, findLLMOrThrow } from '~/modules/llms/store-llms';
import { browserLangOrUS } from '~/common/util/pwaUtils';

/**
 * This will be made a module and fully reactive in the future.
 */
export function bareBonesPromptMixer(
  _template: string,
  assistantLlmId: DLLMId | undefined,
  customFields: Record<string, string> | undefined = undefined
): string {
  let mixed = _template;

  // {{Today}} - yyyy-mm-dd but in user's local time, not UTC
  const today = new Date();
  const varToday =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');
  mixed = mixed.replaceAll('{{Today}}', varToday);

  // {{LocaleNow}} - enough information to get on the same page with the user
  if (mixed.includes('{{LocaleNow}}')) {
    const formatter = new Intl.DateTimeFormat(browserLangOrUS, {
      weekday: 'short', // Full name of the day of the week
      year: 'numeric', // Numeric year
      month: 'short', // Full name of the month
      day: 'numeric', // Numeric day of the month
      hour: '2-digit', // 2-digit hour
      minute: '2-digit', // 2-digit minute
      timeZoneName: 'short', // Short timezone name (e.g., GMT, CST)
      hour12: true, // Use 12-hour time format; set to false for 24-hour format if preferred
    });
    const formattedDateTime = formatter.format(new Date());
    mixed = mixed.replaceAll('{{LocaleNow}}', formattedDateTime /*`${formattedDateTime} (${userTimezone})`*/);
  }

  // Static replacements
  // {{Prefer...}}
  mixed = mixed.replaceAll('{{PreferTables}}', 'Data presentation: prefer tables (auto-columns)');
  // {{Render...}}
  mixed = mixed.replaceAll('{{RenderMermaid}}', 'Mermaid rendering: Enabled');
  mixed = mixed.replaceAll('{{RenderPlantUML}}', 'PlantUML rendering: Enabled');
  mixed = mixed.replaceAll('{{RenderSVG}}', 'SVG rendering: Enabled');
  // {{Input...}} / {{Tool...}} - TBA
  mixed = mixed.replaceAll('{{InputImage0}}', 'Image input capabilities: Disabled');
  mixed = mixed.replaceAll('{{ToolBrowser0}}', 'Web browsing capabilities: Disabled');

  // {{Cutoff}} or remove the line
  let varCutoff: string | undefined;
  try {
    if (assistantLlmId)
      varCutoff = findLLMOrThrow(assistantLlmId).trainingDataCutoff;
  } catch (e) {
    // ignore...
  }
  if (varCutoff)
    mixed = mixed.replaceAll(/.*{{\s*Cutoff\s*}}.*/gs, varCutoff);
  else
    mixed = mixed.replaceAll(/.*{{\s*Cutoff\s*}}.*\n?/g, '');

  // Handle custom fields
  if (customFields)
    for (const [placeholder, replacement] of Object.entries(customFields))
      mixed = mixed.replaceAll(placeholder, replacement);

  // at most leave 2 newlines in a row
  mixed = mixed.replace(/\n{3,}/g, '\n\n');

  // Remove any trailing newlines
  mixed = mixed.trimEnd();

  return mixed;
}
