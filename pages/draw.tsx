// src/pages/DrawPage.tsx

import * as React from 'react';
import { AppDraw } from '../apps/draw/AppDraw';
import { WithLayoutProps, withLayout } from '~/common/layout/withLayout';

type DrawPageProps = WithLayoutProps;

const DrawPage: React.FC<DrawPageProps> = ({ layoutProps }) => {
  return <AppDraw {...layoutProps} />;
};

export default withLayout({ type: 'optima' })(DrawPage);
