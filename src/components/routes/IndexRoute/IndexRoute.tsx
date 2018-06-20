import Head from "next/head";
import * as React from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTwitter
} from "react-icons/lib/fa";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntl from "../../../helpers/injectIntl";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

import IconGenius from "../../icons/IconGenius";
import Link from "../../presentation/Link/Link";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import WebsiteListing from "../../presentation/WebsiteListing/WebsiteListing";

interface IStoreProps {
  articles: INewsArticle[];
}

interface IDispatchProps {
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
  }

  public render() {
    const { articles } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <React.Fragment>
        <Head>
          <title>{formatMessage({ id: "BRAND_NAME" })}</title>

          <meta
            content={formatMessage({ id: "INDEX_DESCRIPTION" })}
            name="description"
          />

          <meta property="og:image" content="https://s3.amazonaws.com/mynameisviii-static/homepage-og.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <PageHeader>
          <FormattedMessage id="BRAND_NAME" />
        </PageHeader>

        <div className="Home">
          {articles.length > 0 ? (
            <section className="Home-news">
              <div className="Home-news-content">
                <h2>
                  <FormattedMessage id="LATEST_NEWS" />
                </h2>

                <div className="Home-news-items">
                  <NewsListing isCondensed={true} {...articles[0]} />
                </div>
              </div>
            </section>
          ) : null}

          <section className="Home-bio">
            <div className="Home-bio-content">
              <h2>
                <FormattedMessage id="BIOGRAPHY" />
              </h2>

              <p>
                Viii is a New Zealand-born singer, songwriter,
                multi-instramentalist and producer. Known for his ability to
                take characteristics from his eclectic musical background to
                create a broad palette to paint an interesting and unique
                canvas.
              </p>
              <p>
                Drawing from influences such as ✝✝✝ (Crosses), Nine Inch Nails,
                Puscifer, Banks, Etta Bond, Massive Attack, Portishead and many
                more, creating a colourful source of inspiration.
              </p>
              <p>
                Lyrically, Viii has a distinct common ground of self-reflection
                and understanding, often abstracting the subject in some form –
                either writing symbolically or from an alternate perspective
                about personal life experiences or abstract thoughts.
              </p>
              <p>
                Outside of the music, Viii also handles his own artistic
                direction and other aspects surrounding performances, such as
                photography, graphic design, makeup artistry and fashion.
              </p>
              <p>
                Viii currently releases music under his own independent label,
                Voodoo Creation Records.
              </p>
            </div>
          </section>

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
                  For booking and press enquiries, contact{" "}
                  <Link href="mailto:mgmt@mynameisviii.com">
                    mgmt@mynameisviii.com
                  </Link>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  articles: selectors.getNewsArticlesAsArray(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchLatestNews: actions.fetchLatestNews.started
    },
    dispatch
  );

export default injectIntl(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(IndexRoute)
);
