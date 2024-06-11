import * as React from 'react';
import { Box } from '@mui/joy';
import { withLayout } from '~/common/layout/withLayout';

// Replace this with the actual component for AppWorkspace
// import { AppWorkspace } from '../src/apps/personas/AppWorkspace';
const AppWorkspace = () => <div>AppWorkspace Placeholder</div>;

const PersonasPage = () => {
  // You can pass the actual AppWorkspace component to withLayout
  // instead of the Box component
  const LayoutAppWorkspace = withLayout({ type: 'optima' }, AppWorkspace);

  return <LayoutAppWorkspace />;
};

export default PersonasPage;
