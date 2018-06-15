import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntl from "../../../helpers/injectIntl";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NewsListing from "../../presentation/NewsListing/NewsListing";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  articles: INewsArticle[];
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
    const { articles, hasAllNewsArticles } = this.props;
    const { formatMessage } = this.props.intl;

    const isLoading =
      this.props.isLoading ||
      articles.length !== Object.keys(this.state.loadedListings).length;

    const loadMoreButton = hasAllNewsArticles ? null : (
      <LoadButton isLoading={isLoading} onLoad={this.onLoadMore}>
        <FormattedMessage id="LOAD_MORE" />
      </LoadButton>
    );

    return (
      <React.Fragment>
        <Head>
          <title>
            {formatMessage({ id: "NEWS_TITLE" })}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta
            content={formatMessage({ id: "NEWS_DESCRIPTION" })}
            name="description"
          />
        </Head>

        <PageHeader>
          <FormattedMessage id="NEWS_TITLE" />
        </PageHeader>

        <section className="NewsListings">
          {articles.map(article => (
            <NewsListing
              {...article}
              key={article.slug}
              onLoad={this.onListingLoad}
            />
          ))}
          <ButtonBar>{loadMoreButton}</ButtonBar>
        </section>
      </React.Fragment>
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

export default injectIntl(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(NewsRoute)
);
