import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTwitter,
} from "react-icons/fa";
import { FormattedMessage, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IAppearance, INewsArticle } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import IconGenius from "../../icons/IconGenius";
import AppearanceListing from "../../presentation/AppearanceListing/AppearanceListing";
import Link from "../../presentation/Link/Link";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import WebsiteListing from "../../presentation/WebsiteListing/WebsiteListing";

import "./IndexRoute.scss";

interface IProps extends WrappedComponentProps {
  articles: INewsArticle[];
  fetchAppearances: typeof actions.fetchAppearances.started;
  fetchLatestNews: typeof actions.fetchLatestNews.started;
  hasAllAppearances: boolean;
  isAppearancesLoading: boolean;
  upcomingAppearances: IAppearance[];
}

class IndexRoute extends React.Component<IProps> {
  public static getInitialProps = async (context: IPageContext) => {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || !selectors.getHasAllNewsArticles(state)) {
      store.dispatch(actions.fetchLatestNews.started({}));
    }

    if (isServer || !selectors.getHasAllAppearances(state)) {
      store.dispatch(actions.fetchAppearances.started({}));
    }
  };

  public render() {
    const { formatMessage } = this.props.intl;

    const hasNewsSection = this.props.articles.length > 0;
    const hasAppearancesSection = this.props.upcomingAppearances.length > 0;

    const pageTitle = formatMessage({ id: "BRAND_NAME" });
    const pageDescription = formatMessage({ id: "INDEX_DESCRIPTION" });

    return (
      <>
        <Head>
          <title>{pageTitle}</title>

          <meta content={pageDescription} name="description" />

          <meta content={pageTitle} property="og:title" />
          <meta content={pageDescription} property="og:description" />
          <meta content={absoluteUrl("/")} property="og:url" />
          <meta content="website" property="og:type" />
          <meta content={s3ThemeUrl("/og/home.jpg")} property="og:image" />
          <meta content="1200" property="og:image:width" />
          <meta content="630" property="og:image:height" />
        </Head>

        <PageHeader>
          <FormattedMessage id="BRAND_NAME" />
        </PageHeader>

        <div
          className={cn("Home", { hasAppearancesSection }, { hasNewsSection })}
        >
          {hasNewsSection ? this.renderNewsSection() : null}
          {hasAppearancesSection ? this.renderAppearancesSection() : null}
          {this.renderBioSection()}
          {this.renderConnectSection()}
        </div>
      </>
    );
  }

  private renderNewsSection = () => (
    <section className="Home--news">
      <div className="Home--news--content">
        <h2>
          <FormattedMessage id="LATEST_NEWS" />
        </h2>

        <div className="Home-news-items">
          <NewsListing isCondensed {...this.props.articles[0]} />
        </div>
      </div>
    </section>
  );

  private renderAppearancesSection = () => (
    <section className="Home--appearances">
      <div className="Home--appearances--content">
        <h2>
          <FormattedMessage id="NEXT_APPEARANCE" />
        </h2>

        <div className="Home--appearances--items">
          <AppearanceListing
            isCondensed
            {...this.props.upcomingAppearances[0]}
          />
        </div>
      </div>
    </section>
  );

  private renderBioSection = () => (
    <section className="Home--bio">
      <div className="Home--bio--content">
        <h2>
          <FormattedMessage id="BIOGRAPHY" />
        </h2>

        <p>
          <FormattedMessage id="BIO_CONTENT_1" />
        </p>
        <p>
          <FormattedMessage id="BIO_CONTENT_2" />
        </p>
        <p>
          <FormattedMessage id="BIO_CONTENT_3" />
        </p>
        <p>
          <FormattedMessage id="BIO_CONTENT_4" />
        </p>
        <p>
          <FormattedMessage id="BIO_CONTENT_5" />
        </p>
      </div>
    </section>
  );

  private renderConnectSection = () => {
    const { formatMessage } = this.props.intl;

    return (
      <section className="Home--connect">
        <div className="Home--connect--content">
          <h2>
            <FormattedMessage id="CONNECT_WITH_VIII" />
          </h2>

          <div className="Home--connect--websites">
            <WebsiteListing
              icon={<FaSpotify />}
              title={formatMessage({ id: "CONNECT_ON_SPOTIFY" })}
              url="https://open.spotify.com/artist/59s4iD384WECjyZyUmZ18G?si=rlWWtIUNS1uvdLD5BzqxvQ"
            >
              <FormattedMessage id="SPOTIFY" />
            </WebsiteListing>

            <WebsiteListing
              icon={<FaFacebookSquare />}
              title={formatMessage({ id: "CONNECT_ON_FACEBOOK" })}
              url="https://facebook.com/mynameisviii"
            >
              <FormattedMessage id="FACEBOOK" />
            </WebsiteListing>

            <WebsiteListing
              icon={<FaTwitter />}
              title={formatMessage({ id: "CONNECT_ON_TWITTER" })}
              url="https://twitter.com/mynameisviii"
            >
              <FormattedMessage id="TWITTER" />
            </WebsiteListing>

            <WebsiteListing
              icon={<FaInstagram />}
              title={formatMessage({ id: "CONNECT_ON_INSTAGRAM" })}
              url="https://instagram.com/mynameisviii"
            >
              <FormattedMessage id="INSTAGRAM" />
            </WebsiteListing>

            <WebsiteListing
              icon={<FaSoundcloud />}
              title={formatMessage({ id: "CONNECT_ON_SOUNDCLOUD" })}
              url="https://soundcloud.com/iamviii"
            >
              <FormattedMessage id="SOUNDCLOUD" />
            </WebsiteListing>

            <WebsiteListing
              icon={<IconGenius />}
              title={formatMessage({ id: "CONNECT_ON_GENIUS" })}
              url="https://genius.com/artists/Viii"
            >
              <FormattedMessage id="GENIUS" />
            </WebsiteListing>
          </div>

          <div className="Home--connect--press">
            <p>
              <FormattedMessage id="BOOKING_AND_PRESS_CONTACT" />{" "}
              <Link href="mailto:mgmt@mynameisviii.com">
                mgmt@mynameisviii.com
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    );
  };
}

const mapState = (state: TStoreState) => ({
  articles: selectors.getNewsArticlesAsArray(state),
  hasAllAppearances: selectors.getHasAllAppearances(state),
  isAppearancesLoading: selectors.getAppearancesIsLoading(state),
  upcomingAppearances: selectors.getUpcomingAppearances(state),
});

const mapActions = {
  fetchAppearances: actions.fetchAppearances.started,
  fetchLatestNews: actions.fetchLatestNews.started,
};

export default injectIntlIntoPage(connect(mapState, mapActions)(IndexRoute));
