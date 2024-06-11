import * as React from 'react';
import { Tooltip } from '@mui/joy';
import { Brand } from '~/common/app.config';
import { StackBlitzIcon } from '~/common/components/icons/3rdparty/StackBlitzIcon';
import { prettyTimestampForFilenames } from '~/common/util/timeUtils';
import { OverlayButton } from './RenderCode';

const supportedLanguages = [
  'typescript',
  'javascript', 'json',
  'html', 'css',
  // 'python',
];

const languageToTemplateMapping: { [language: string]: string } = {
  typescript: 'ts',
  javascript: 'js', json: 'js',
  html: 'html', css: 'html',
  // python: 'py',
};

const languageToFileExtensionMapping: { [language: string]: string } = {
  typescript: 'index.ts',
  javascript: 'index.js', json: 'data.json',
  html: 'index.html', css: 'style.css',
  // python: 'main.py',
};

const isStackBlitzSupported = (language: string | null): boolean => {
  return supportedLanguages.includes(language || '');
};

const handleOpenInStackBlitz = (code: string, language: string, title?: string): void => {
  const template = languageToTemplateMapping[language] || 'js';
  const fileName = languageToFileExtensionMapping[language] || 'index.js';

  const projectDetails = {
    files: { [fileName]: code },
    template,
    description: `${Brand.Title.Common} file created on ${prettyTimestampForFilenames()}`,
    title: language === 'python' ? 'Python Starter' : title,
  };

  const form = document.createElement('form');
  form.action = 'https://stackblitz.com/run';
  form.method = 'POST';
  form.target = '_blank';

  Object.entries(projectDetails.files).forEach(([filePath, content]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = `project[files][${filePath}]`;
    input.value = content;
    form.appendChild(input);
  });

  Object.entries(projectDetails).forEach(([name, value]) => {
    if (name !== 'files') {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `project[${name}]`;
      input.value = value as string;
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const ButtonStackBlitz: React.FC<{ code: string, language: string, title?: string }> = (props) => {
  return (
    <Tooltip title='Open in StackBlitz' variant='solid'>
      <OverlayButton variant='outlined' onClick={() => handleOpenInStackBlitz(props.code, props.language, props.title)}>
        <StackBlitzIcon />
      </OverlayButton>
    </Tooltip>
  );
};
