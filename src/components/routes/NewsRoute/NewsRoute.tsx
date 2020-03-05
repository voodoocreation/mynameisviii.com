import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { INewsArticle } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import "./NewsRoute.scss";

interface IProps extends WrappedComponentProps {
  articles: INewsArticle[];
  articlesCount: number;
  hasError: boolean;
  fetchLatestNews: typeof actions.fetchLatestNews.started;
  fetchMoreLatestNews: typeof actions.fetchMoreLatestNews.started;
  hasAllNewsArticles: boolean;
  isLoading: boolean;
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class NewsRoute extends React.Component<IProps, IState> {
  public readonly state: IState = {
    loadedListings: {}
  };

  public static getInitialProps = async (context: IPageContext) => {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || selectors.getNewsArticlesCount(state) === 0) {
      store.dispatch(actions.fetchLatestNews.started({}));
    } else if (!selectors.getHasAllNewsArticles(state)) {
      store.dispatch(actions.fetchMoreLatestNews.started({}));
    }
  };

  public render() {
    const {
      articles,
      articlesCount,
      hasAllNewsArticles,
      hasError
    } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      articlesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

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

          <meta content={pageTitle} property="og:title" />
          <meta content={pageDescription} property="og:description" />
          <meta content="website" property="og:type" />
          <meta content={s3ThemeUrl("/og/news.jpg")} property="og:image" />
          <meta content={absoluteUrl("/news")} property="og:url" />
        </Head>

        <PageHeader>
          <FormattedMessage id="NEWS_TITLE" />
        </PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {articlesCount > 0 ? (
          <section className="NewsRoute--listings">
            {articles.map(article => (
              <NewsListing
                {...article}
                key={article.slug}
                onLoad={this.onListingLoad(article)}
              />
            ))}
          </section>
        ) : null}

        {hasAllNewsArticles && articlesCount === 0 ? (
          <NoResults entityIntlId="ARTICLE" />
        ) : null}

        <ButtonBar>
          {!hasAllNewsArticles ? (
            <LoadButton
              hasError={hasError}
              isLoading={isLoading}
              onLoad={this.onLoadMore}
            />
          ) : null}
        </ButtonBar>
      </article>
    );
  }

  private onListingLoad = (article: INewsArticle) => () => {
    this.setState(state => ({
      loadedListings: {
        ...state.loadedListings,
        [article.slug]: true
      }
    }));
  };

  private onLoadMore = () => {
    this.props.fetchMoreLatestNews({});
  };
}

const mapState = (state: TStoreState) => ({
  articles: selectors.getNewsArticlesAsArray(state),
  articlesCount: selectors.getNewsArticlesCount(state),
  hasAllNewsArticles: selectors.getHasAllNewsArticles(state),
  hasError: selectors.hasNewsError(state),
  isLoading: selectors.getNewsIsLoading(state)
});

const mapActions = {
  fetchLatestNews: actions.fetchLatestNews.started,
  fetchMoreLatestNews: actions.fetchMoreLatestNews.started
};

export default injectIntlIntoPage(connect(mapState, mapActions)(NewsRoute));
