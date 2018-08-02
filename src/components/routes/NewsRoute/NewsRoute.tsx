import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  articles: INewsArticle[];
  articlesCount: number;
  hasAllNewsArticles: boolean;
  isLoading: boolean;
}

interface IDispatchProps {
  fetchLatestNews: ActionCreator<{}>;
  fetchMoreLatestNews: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class NewsRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getNewsArticlesCount(state) === 0) {
      store.dispatch(actions.fetchLatestNews.started({}));
    } else if (!selectors.getHasAllNewsArticles(state)) {
      store.dispatch(actions.fetchMoreLatestNews.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const { articles, articlesCount, hasAllNewsArticles } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      articlesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllNewsArticles ? null : (
      <LoadButton isLoading={isLoading} onLoad={this.onLoadMore}>
        <FormattedMessage id="LOAD_MORE" />
      </LoadButton>
    );

    const pageTitle = formatMessage({ id: "NEWS_TITLE" });
    const pageDescription = formatMessage({ id: "NEWS_DESCRIPTION" });

    return (
      <article className={cn("NewsRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/news-og.jpg"
          />
          <meta property="og:url" content={absUrl("/news")} />
          <meta property="og:type" content="website" />
        </Head>

        <PageHeader>
          <FormattedMessage id="NEWS_TITLE" />
        </PageHeader>

        {articlesCount > 0 ? (
          <section className="NewsListings">
            {articles.map(article => (
              <NewsListing
                {...article}
                key={article.slug}
                onLoad={this.onListingLoad}
              />
            ))}
          </section>
        ) : null}

        {hasAllNewsArticles && articlesCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_NEWS" />
            </p>
          </NoResults>
        ) : null}

        <ButtonBar>{loadMoreButton}</ButtonBar>
      </article>
    );
  }

  private onListingLoad = (slug: string) => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreLatestNews({});
  };
}

const mapStateToProps = (state: any) => ({
  articles: selectors.getNewsArticlesAsArray(state),
  articlesCount: selectors.getNewsArticlesCount(state),
  hasAllNewsArticles: selectors.getHasAllNewsArticles(state),
  isLoading: selectors.getNewsIsLoading(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchLatestNews: actions.fetchLatestNews.started,
      fetchMoreLatestNews: actions.fetchMoreLatestNews.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(NewsRoute)
);
