import Head from "next/head";
import * as React from "react";
import { InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import ConnectedErrorPage from "../../containers/ConnectedErrorPage/ConnectedErrorPage";
import NewsArticle from "../../presentation/NewsArticle/NewsArticle";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  article?: INewsArticle;
}

interface IDispatchProps {
  fetchNewsArticleBySlug: ActionCreator<PLFetchNewsArticleBySlugStarted>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class NewsArticleRoute extends React.Component<IProps> {
  public static async getInitialProps(props: any) {
    const { query, store } = props.ctx;

    store.dispatch(actions.setCurrentNewsArticleSlug(query.slug));

    const state = store.getState();

    if (!selectors.getCurrentNewsArticle(state)) {
      store.dispatch(actions.fetchNewsArticleBySlug.started(query.slug));
    }
  }

  public render() {
    const { article } = this.props;
    const { formatMessage } = this.props.intl;

    if (!article) {
      return <ConnectedErrorPage />;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {article.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={article.excerpt} name="description" />

          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.excerpt} />
          <meta property="og:url" content={absUrl(`/news/${article.slug}`)} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={article.createdAt} />
          <meta property="article:author" content={article.author} />
          <meta property="og:image" content={article.ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <NewsArticle {...article} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  article: selectors.getCurrentNewsArticle(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchNewsArticleBySlug: actions.fetchNewsArticleBySlug.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(NewsArticleRoute)
);
