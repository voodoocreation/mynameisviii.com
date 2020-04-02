import Head from "next/head";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { INewsArticle } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import Loader from "../../presentation/Loader/Loader";
import NewsArticle from "../../presentation/NewsArticle/NewsArticle";

interface IProps extends WrappedComponentProps {
  article?: INewsArticle;
  fetchNewsArticleBySlug: typeof actions.fetchNewsArticleBySlug.started;
  isLoading: boolean;
}

class NewsArticleRoute extends React.Component<IProps> {
  public static getInitialProps = async (context: IPageContext) => {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentNewsArticleSlug(slug));

    const state = store.getState();

    if (!selectors.getCurrentNewsArticle(state)) {
      store.dispatch(actions.fetchNewsArticleBySlug.started(slug));
    }
  };

  public render() {
    const { article, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!article) {
      return null;
    }

    return (
      <>
        <Head>
          <title>
            {article.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={article.excerpt} name="description" />

          <meta content={article.title} property="og:title" />
          <meta content={article.excerpt} property="og:description" />
          <meta
            content={absoluteUrl(`/news/${article.slug}`)}
            property="og:url"
          />
          <meta content="article" property="og:type" />
          <meta content={article.createdAt} property="article:published_time" />
          <meta content={article.author} property="article:author" />
          <meta content={article.ogImageUrl} property="og:image" />
          <meta content="1200" property="og:image:width" />
          <meta content="630" property="og:image:height" />
        </Head>

        <NewsArticle {...article} />
      </>
    );
  }
}

const mapState = (state: TStoreState) => ({
  article: selectors.getCurrentNewsArticle(state),
  isLoading: selectors.getNewsIsLoading(state),
});

const mapActions = {
  fetchNewsArticleBySlug: actions.fetchNewsArticleBySlug.started,
};

export default injectIntlIntoPage(
  connect(mapState, mapActions)(NewsArticleRoute)
);
