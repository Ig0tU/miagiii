import React from 'react';
import { Box } from '@mui/joy';
import { withLayout } from '~/common/layout/withLayout';

// Replace this with the actual component for AppWorkspace
const AppWorkspace: React.FC = () => <div>AppWorkspace Placeholder</div>;

export const PersonasPage: React.FC = () => {
  return <withLayout({ type: 'optima' })(AppWorkspace) />;
};
