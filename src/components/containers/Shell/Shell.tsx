import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";

import Banner from "../../presentation/Banner/Banner";
import Loader from "../../presentation/Loader/Loader";
import OnlineStatusToast from "../../presentation/OnlineStatusToast/OnlineStatusToast";
import ToastContainer from "../../presentation/ToastContainer/ToastContainer";
import InstallPromptToast from "../InstallPromptToast/InstallPromptToast";

import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  isLoading: boolean;
  isOnline: boolean;
}

interface IProps extends IStoreProps {
  className?: string;
  intl: InjectedIntl;
}

class Shell extends React.Component<IProps> {
  public componentWillMount() {
    if (
      typeof document !== "undefined" &&
      !document.documentElement.classList.contains("isClientRendered")
    ) {
      document.documentElement.classList.add("isClientRendered");
    }
  }

  public render() {
    const { children, className, isLoading, isOnline } = this.props;
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
          <InstallPromptToast />
        </ToastContainer>
      </article>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isLoading: selectors.getPageIsLoading(state),
  isOnline: selectors.isOnline(state)
});

export default injectIntl<any>(connect<IStoreProps>(mapStateToProps)(Shell));
