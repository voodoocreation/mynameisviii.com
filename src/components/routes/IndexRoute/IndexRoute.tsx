import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTwitter
} from "react-icons/fa";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import IconGenius from "../../icons/IconGenius";
import Link from "../../presentation/Link/Link";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import WebsiteListing from "../../presentation/WebsiteListing/WebsiteListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";
import AppearanceListing from "../../presentation/AppearanceListing/AppearanceListing";

interface IStoreProps {
  articles: INewsArticle[];
  hasAllAppearances: boolean;
  isAppearancesLoading: boolean;
  upcomingAppearances: IAppearance[];
}

interface IDispatchProps {
  fetchAppearances: ActionCreator<{}>;
  fetchLatestNews: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class IndexRoute extends React.Component<IProps> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || !selectors.getHasAllNewsArticles(state)) {
      store.dispatch(actions.fetchLatestNews.started({}));
    }

    if (isServer || !selectors.getHasAllAppearances(state)) {
      store.dispatch(actions.fetchAppearances.started({}));
    }
  }

  public render() {
    const { formatMessage } = this.props.intl;

    const hasAppearancesSection = this.props.upcomingAppearances.length > 0;

    const pageTitle = formatMessage({ id: "BRAND_NAME" });
    const pageDescription = formatMessage({ id: "INDEX_DESCRIPTION" });

    return (
      <React.Fragment>
        <Head>
          <title>{pageTitle}</title>

          <meta content={pageDescription} name="description" />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={absUrl("/")} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/theme/heart/og/home.jpg"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <PageHeader>
          <FormattedMessage id="BRAND_NAME" />
        </PageHeader>

        <div className={cn("Home", { hasAppearancesSection })}>
          {this.renderNewsSection()}
          {hasAppearancesSection ? this.renderAppearancesSection() : null}
          {this.renderBioSection()}
          {this.renderConnectSection()}
        </div>
      </React.Fragment>
    );
  }

  private renderNewsSection = () =>
    this.props.articles.length < 1 ? null : (
      <section className="Home-news">
        <div className="Home-news-content">
          <h2>
            <FormattedMessage id="LATEST_NEWS" />
          </h2>

          <div className="Home-news-items">
            <NewsListing isCondensed={true} {...this.props.articles[0]} />
          </div>
        </div>
      </section>
    );

  private renderAppearancesSection = () => (
    <section className="Home-appearances">
      <div className="Home-appearances-content">
        <h2>
          <FormattedMessage id="NEXT_APPEARANCE" />
        </h2>

        <div className="Home-appearances-items">
          <AppearanceListing
            isCondensed={true}
            {...this.props.upcomingAppearances[0]}
          />
        </div>
      </div>
    </section>
  );

  private renderBioSection = () => (
    <section className="Home-bio">
      <div className="Home-bio-content">
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
      <section className="Home-connect">
        <div className="Home-connect-content">
          <h2>
            <FormattedMessage id="CONNECT_WITH_VIII" />
          </h2>

          <div className="Home-connect-websites">
            <WebsiteListing
              icon={<FaSpotify />}
              url="https://open.spotify.com/artist/59s4iD384WECjyZyUmZ18G?si=rlWWtIUNS1uvdLD5BzqxvQ"
              title={formatMessage({ id: "CONNECT_ON_SPOTIFY" })}
            >
              <FormattedMessage id="SPOTIFY" />
            </WebsiteListing>
            <WebsiteListing
              icon={<FaFacebookSquare />}
              url="https://facebook.com/mynameisviii"
              title={formatMessage({ id: "CONNECT_ON_FACEBOOK" })}
            >
              <FormattedMessage id="FACEBOOK" />
            </WebsiteListing>
            <WebsiteListing
              icon={<FaTwitter />}
              url="https://twitter.com/mynameisviii"
              title={formatMessage({ id: "CONNECT_ON_TWITTER" })}
            >
              <FormattedMessage id="TWITTER" />
            </WebsiteListing>
            <WebsiteListing
              icon={<FaInstagram />}
              url="https://instagram.com/mynameisviii"
              title={formatMessage({ id: "CONNECT_ON_INSTAGRAM" })}
            >
              <FormattedMessage id="INSTAGRAM" />
            </WebsiteListing>
            <WebsiteListing
              icon={<FaSoundcloud />}
              url="https://soundcloud.com/iamviii"
              title={formatMessage({ id: "CONNECT_ON_SOUNDCLOUD" })}
            >
              <FormattedMessage id="SOUNDCLOUD" />
            </WebsiteListing>
            <WebsiteListing
              icon={<IconGenius />}
              url="https://genius.com/artists/Viii"
              title={formatMessage({ id: "CONNECT_ON_GENIUS" })}
            >
              <FormattedMessage id="GENIUS" />
            </WebsiteListing>
          </div>

          <div className="Home-connect-press">
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

const mapStateToProps = (state: any) => ({
  articles: selectors.getNewsArticlesAsArray(state),
  hasAllAppearances: selectors.getHasAllAppearances(state),
  isAppearancesLoading: selectors.getAppearancesIsLoading(state),
  upcomingAppearances: selectors.getUpcomingAppearances(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearances: actions.fetchAppearances.started,
      fetchLatestNews: actions.fetchLatestNews.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(IndexRoute)
);
