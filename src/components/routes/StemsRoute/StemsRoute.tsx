import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import OfflineNotice from "../../containers/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import StemListing from "../../presentation/StemListing/StemListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  error?: IError;
  hasAllStems: boolean;
  isLoading: boolean;
  stems: IStem[];
  stemsCount: number;
}

interface IDispatchProps {
  fetchMoreStems: ActionCreator<{}>;
  fetchStems: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class StemsRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getStemsCount(state) === 0) {
      store.dispatch(actions.fetchStems.started({}));
    } else if (!selectors.getHasAllStems(state)) {
      store.dispatch(actions.fetchMoreStems.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const { error, hasAllStems, stems, stemsCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      stemsCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllStems ? null : (
      <LoadButton
        isLoading={isLoading}
        isScrollLoadEnabled={!error}
        onLoad={this.onLoadMore}
      >
        {!error ? (
          <FormattedMessage id="LOAD_MORE" />
        ) : (
          <FormattedMessage id="TRY_AGAIN" />
        )}
      </LoadButton>
    );

    const pageTitle = formatMessage({ id: "STEMS_TITLE" });
    const pageDescription = formatMessage({ id: "STEMS_DESCRIPTION" });

    return (
      <article className={cn("StemsRoute", { hasLoadedAllListings })}>
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
            content="https://s3.amazonaws.com/mynameisviii-static/stems-og.jpg"
          />
          <meta property="og:url" content={absUrl("/stems")} />
        </Head>

        <PageHeader>{pageTitle}</PageHeader>

        {error ? <OfflineNotice /> : null}

        {stemsCount < 1 ? null : (
          <section className="StemListings">
            {stems.map(stem => (
              <StemListing
                {...stem}
                key={stem.slug}
                onLoad={this.onListingLoad}
              />
            ))}
          </section>
        )}

        {hasAllStems && stemsCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_STEMS" />
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
    this.props.fetchMoreStems({});
  };
}

const mapStateToProps = (state: any) => ({
  error: selectors.getStemsError(state),
  hasAllStems: selectors.getHasAllStems(state),
  isLoading: selectors.getStemsIsLoading(state),
  stems: selectors.getStemsAsArray(state),
  stemsCount: selectors.getStemsCount(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMoreStems: actions.fetchMoreStems.started,
      fetchStems: actions.fetchStems.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(StemsRoute)
);
