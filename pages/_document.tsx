import * as React from 'react';
import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { getInitColorSchemeScript } from '@mui/joy/styles';
import { createEmotionCache } from '../common/app.theme';
import { Brand } from '../common/app.config';

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: React.JSX.Element[];
}

const MyDocument = ({ emotionStyleTags }: MyDocumentProps) => (
  <Html lang="en">
    <Head>
      {/* Meta (missing Title, set by the App or Page) */}
      <meta name="description" content={Brand.Meta.Description} />
      <meta name="theme-color" content={Brand.Meta.ThemeColor} />

      {/* Favicons & PWA */}
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/* Opengraph */}
      <meta property="og:title" content={Brand.Title.Common} />
      <meta property="og:description" content={Brand.Meta.Description} />
      {Brand.URIs.CardImage && <meta property="og:image" content={Brand.URIs.CardImage} />}
      <meta property="og:url" content={Brand.URIs.Home} />
      <meta property="og:site_name" content={Brand.Meta.SiteName} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={Brand.URIs.Home} />
      <meta property="twitter:title" content={Brand.Title.Common} />
      <meta property="twitter:description" content={Brand.Meta.Description} />
      {Brand.URIs.CardImage && <meta property="twitter:image" content={Brand.URIs.CardImage} />}
      <meta name="twitter:site" content={Brand.Meta.TwitterSite} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Style Sheets (injected and server-side) */}
      <meta name="emotion-insertion-point" content="" />
      {emotionStyleTags}
    </Head>
    <body>
      {getInitColorSchemeScript()}
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<any>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MyDocument;
