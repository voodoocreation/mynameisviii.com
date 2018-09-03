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
import AppearanceListing from "../../presentation/AppearanceListing/AppearanceListing";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  appearancesCount: number;
  error?: IError;
  hasAllAppearances: boolean;
  isLoading: boolean;
  pastAppearances: IAppearance[];
  upcomingAppearances: IAppearance[];
}

interface IDispatchProps {
  fetchAppearances: ActionCreator<{}>;
  fetchMoreAppearances: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class AppearancesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getAppearancesCount(state) === 0) {
      store.dispatch(actions.fetchAppearances.started({}));
    } else if (!selectors.getHasAllAppearances(state)) {
      store.dispatch(actions.fetchMoreAppearances.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const {
      appearancesCount,
      error,
      hasAllAppearances,
      pastAppearances,
      upcomingAppearances
    } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      appearancesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllAppearances ? null : (
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

    const pageTitle = formatMessage({ id: "APPEARANCES_TITLE" });
    const pageDescription = formatMessage({ id: "APPEARANCES_DESCRIPTION" });

    return (
      <article className={cn("AppearancesRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/appearances-og.jpg"
          />
          <meta property="og:url" content={absUrl("/appearances")} />
        </Head>

        <PageHeader>{pageTitle}</PageHeader>

        {error ? <OfflineNotice /> : null}

        {upcomingAppearances.length > 0 ? (
          <section className="AppearanceListings AppearanceListings-upcoming">
            <h2>
              <FormattedMessage id="UPCOMING" />
            </h2>

            <div className="AppearanceListings-items">
              {upcomingAppearances.map(appearance => (
                <AppearanceListing
                  key={appearance.slug}
                  onLoad={this.onListingLoad}
                  {...appearance}
                />
              ))}
            </div>
          </section>
        ) : null}

        {pastAppearances.length > 0 ? (
          <section className="AppearanceListings AppearanceListings-past">
            <h2>
              <FormattedMessage id="PAST" />
            </h2>

            <div className="AppearanceListings-items">
              {pastAppearances.map(appearance => (
                <AppearanceListing key={appearance.slug} {...appearance} />
              ))}
            </div>
          </section>
        ) : null}

        {hasAllAppearances && appearancesCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_APPEARANCES" />
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
    this.props.fetchMoreAppearances({});
  };
}

const mapStateToProps = (state: any) => ({
  appearancesCount: selectors.getAppearancesCount(state),
  error: selectors.getAppearancesError(state),
  hasAllAppearances: selectors.getHasAllAppearances(state),
  isLoading: selectors.getAppearancesIsLoading(state),
  pastAppearances: selectors.getPastAppearances(state),
  upcomingAppearances: selectors.getUpcomingAppearances(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearances: actions.fetchAppearances.started,
      fetchMoreAppearances: actions.fetchMoreAppearances.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(AppearancesRoute)
);
