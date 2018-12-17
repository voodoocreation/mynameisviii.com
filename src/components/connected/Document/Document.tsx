import { IncomingMessage } from "http";
import Document, {
  DocumentProps,
  Head,
  Main,
  NextDocumentContext as Context,
  NextScript
} from "next/document";
import * as React from "react";

const isDev = () => process.env.NODE_ENV !== "production";

// tslint:disable-next-line
const css = require("../../../scss/index.scss");

const Meta: React.SFC<{}> = () =>
  (
    <React.Fragment>
      <meta charSet="UTF-8" />
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        name="viewport"
      />

      <meta property="fb:app_id" content="278225392903510" />
      <meta property="fb:page_id" content="218519344943411" />

      <link rel="manifest" href="/static/manifest.json" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/favicon/apple-touch-icon.png"
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
        color="#540008"
      />
      <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#540008" />
      <meta name="theme-color" content="#ffeaea" />
    </React.Fragment>
  ) as React.ReactElement<any>;

const AnalyticsHead: React.SFC<{}> = () =>
  (
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
  ) as React.ReactElement<any>;

const AnalyticsBody: React.SFC<{}> = () =>
  (
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
  ) as React.ReactElement<any>;

interface IProps extends DocumentProps {
  locale: string;
}

// @ts-ignore-next-line
export default class extends Document<IProps> {
  public static async getInitialProps(context: Context) {
    const initialProps = await Document.getInitialProps(context);
    const props = await context.renderPage();
    const req = context.req as IncomingMessage & {
      intlMessages: {};
      locale: string;
    };

    return {
      ...initialProps,
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
        <link href="/assets/main.css" rel="stylesheet" />
      );

    return (
      <html lang={this.props.locale}>
        <Head>
          <AnalyticsHead />
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.add("isClientRendered");`
            }}
          />
          <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBO41slvNUu9QtGI9aNZ4RLeqBlD13y_5M" />

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
