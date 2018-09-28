import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { isServer } from "../../../helpers/dom";
import Banner from "../../presentation/Banner/Banner";
import Button from "../../presentation/Button/Button";
import Loader from "../../presentation/Loader/Loader";
import OnlineStatusToast from "../../presentation/OnlineStatusToast/OnlineStatusToast";
import Toast from "../../presentation/Toast/Toast";
import ToastContainer from "../../presentation/ToastContainer/ToastContainer";

import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  hasNewVersion: boolean;
  isLoading: boolean;
  isOnline: boolean;
}

interface IProps extends IStoreProps {
  className?: string;
  intl: InjectedIntl;
}

class Shell extends React.Component<IProps> {
  public componentWillMount() {
    if (!isServer()) {
      const html = document.documentElement as HTMLHtmlElement;
      html.classList.add("isClientRendered");
    }
  }

  public render() {
    const {
      children,
      className,
      hasNewVersion,
      isLoading,
      isOnline
    } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <article className={cn("Page", { isLoading }, className)}>
        <Head>
          <meta
            property="og:site_name"
            content={formatMessage({ id: "BRAND_NAME" })}
          />
        </Head>

        <Banner />

        <main className="Page-body" role="main">
          {isLoading ? <Loader className="PageLoader" /> : children}
        </main>

        <ToastContainer>
          <OnlineStatusToast isOnline={isOnline} />

          <Toast
            className="HasNewVersionToast"
            hasAutoDismiss={false}
            isVisible={hasNewVersion}
          >
            <FormattedMessage id="NEW_VERSION_AVAILABLE" />
            <Button
              className="HasNewVersionToast-refreshButton"
              onClick={this.onRefreshClick}
            >
              <FormattedMessage id="REFRESH" />
            </Button>
          </Toast>
        </ToastContainer>
      </article>
    );
  }

  private onRefreshClick = () => {
    window.location.reload(true);
  };
}

const mapStateToProps = (state: any) => ({
  hasNewVersion: selectors.hasNewVersion(state),
  isLoading: selectors.getPageIsLoading(state),
  isOnline: selectors.isOnline(state)
});

export default injectIntl<any>(connect<IStoreProps>(mapStateToProps)(Shell));
