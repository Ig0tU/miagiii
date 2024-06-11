import * as React from 'react';
import { useRouter } from 'next/router';
import { PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { checkVisibleNav, navItems } from '~/common/app.nav';
import { useIsMobile } from '~/common/components/useMatchMedia';

import { DesktopDrawer, DesktopDrawerProps } from './DesktopDrawer';
import { DesktopNav, DesktopNavProps } from './DesktopNav';
import { MobileDrawer, MobileDrawerProps } from './MobileDrawer';
import { Modals, ModalsProps } from './Modals';
import { OptimaDrawerProvider } from './useOptimaDrawers';
import { OptimaLayoutProvider } from './useOptimaLayout';
import { PageWrapper, PageWrapperProps } from './PageWrapper';

export type OptimaLayoutProps = {
  suspendAutoModelsSetup?: boolean;
  children: React.ReactNode;
};

export function OptimaLayout({
  suspendAutoModelsSetup,
  children,
}: OptimaLayoutProps): React.ReactElement {
  // external state
  const { route } = useRouter();
  const isMobile = useIsMobile();

  // derived state
  const currentApp = navItems.apps.find((item) => item.route === route);

  const desktopDrawerProps: DesktopDrawerProps = {
    component: 'aside',
    currentApp,
    collapsed: !checkVisibleNav(currentApp),
  };

  const desktopNavProps: DesktopNavProps = {
    component: 'nav',
    currentApp,
  };

  const mobileDrawerProps: MobileDrawerProps = {
    component: 'aside',
    currentApp,
  };

  const modalsProps: ModalsProps = {
    suspendAutoModelsSetup,
  };

  const pageWrapperProps: PageWrapperProps = {
    component: 'main',
    currentApp,
  };

  const panelGroupProps = {
    direction: 'horizontal' as const,
    id: 'root-layout',
    resizeHandles: ['s'],
    className: 'optima-layout',
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: isMobile
        ? `"nav nav" "drawer drawer" "main main"`
        : `"nav nav" "drawer main" "drawer main"`,
    },
    defaultSize: isMobile ? 0 : 250,
    minSize: 0,
    maxSize: isMobile ? 100 : 500,
    disabled: isMobile,
    onChange: (size) => {
      console.log('Panel size changed:', size);
    },
  };

  return (
    <OptimaLayoutProvider>
      <OptimaDrawerProvider>
        {isMobile ? (
          <>
            <PageWrapper {...pageWrapperProps} key="main">
              {children}
            </PageWrapper>
            <MobileDrawer {...mobileDrawerProps} />
          </>
        ) : (
          <PanelGroup {...panelGroupProps}>
            {checkVisibleNav(currentApp) && <DesktopNav {...desktopNavProps} />}
            <DesktopDrawer {...desktopDrawerProps} />
            <PageWrapper {...pageWrapperProps} />
          </PanelGroup>
        )}
      </OptimaDrawerProvider>
      <Modals {...modalsProps} />
    </OptimaLayoutProvider>
  );
}

export { OptimaLayout as default };
