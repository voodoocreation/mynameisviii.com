import { IncomingMessage } from "http";
import Document, {
  Head,
  Main,
  NextDocumentContext as Context,
  NextScript
} from "next/document";
import * as React from "react";

const isDev = () => process.env.NODE_ENV !== "production";

// tslint:disable-next-line
const css = require("../../../scss/index.scss");

const Meta: React.SFC<{}> = () => (
  <React.Fragment>
    <meta charSet="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />

    <meta name="theme-color" content="#160f20" />
    <meta name="msapplication-TileColor" content="#160f20" />
    <meta
      name="msapplication-TileImage"
      content="/static/favicon/mstile-150x150.png"
    />
    <link rel="icon" href="/static/favicon/favicon.ico" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/favicon/apple-touch-icon.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="/static/favicon/apple-touch-icon-152x152.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="144x144"
      href="/static/favicon/apple-touch-icon-144x144.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="/static/favicon/apple-touch-icon-120x120.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="114x114"
      href="/static/favicon/apple-touch-icon-114x114.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="76x76"
      href="/static/favicon/apple-touch-icon-76x76.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="72x72"
      href="/static/favicon/apple-touch-icon-72x72.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="60x60"
      href="/static/favicon/apple-touch-icon-60x60.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="57x57"
      href="/static/favicon/apple-touch-icon-57x57.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/static/favicon/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/static/favicon/favicon-16x16.png"
    />
    <link
      rel="mask-icon"
      href="/static/favicon/safari-pinned-tab.svg"
      color="#160f20"
    />
    <link rel="manifest" href="/static/manifest.json" />
  </React.Fragment>
);

const AnalyticsHead: React.SFC<{}> = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl${
          isDev()
            ? `+ '&gtm_auth=5N0VfAOq-iEoyMOidFx0kQ&gtm_preview=env-3&gtm_cookies_win=x'`
            : ""
        };f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TJZ52XC');`
    }}
  />
);

const AnalyticsBody: React.SFC<{}> = () => (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=GTM-TJZ52XC${
        isDev()
          ? `&gtm_auth=5N0VfAOq-iEoyMOidFx0kQ&gtm_preview=env-3&gtm_cookies_win=x`
          : ""
      }`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
);

export default class extends Document {
  public static async getInitialProps(context: Context) {
    const props = await context.renderPage();
    const req = context.req as IncomingMessage & {
      intlMessages: {};
      locale: string;
    };

    return {
      ...props,
      intlMessages: req.intlMessages,
      locale: req.locale
    };
  }

  public render() {
    const styles =
      process.env.NODE_ENV !== "production" ? (
        <style dangerouslySetInnerHTML={{ __html: css }} />
      ) : (
        <link
          href={`/assets/main.css?${this.props.__NEXT_DATA__.buildId}`}
          rel="stylesheet"
        />
      );

    return (
      <html lang={this.props.locale}>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.add("isClientRendered");`
            }}
          />
          <AnalyticsHead />
          <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDPZBC30DN_SjkhZRMd1AX8MscrqdVsQbE" />

          <Meta />

          {styles}
        </Head>
        <body>
          <AnalyticsBody />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
