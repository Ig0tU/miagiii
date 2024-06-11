// Import statements
import * as React from 'react';
import { AppCall } from '../src/apps/call/AppCall';
import { WithLayoutProps, withLayout } from '~/common/layout/withLayout';

// Define the CallPage component
const CallPage: React.FC<WithLayoutProps> = ({ type }) => {
  return <AppCall />;
};

// Apply the withLayout higher-order component
export default withLayout({ type: 'optima' })(CallPage);
