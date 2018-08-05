import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";

import Banner from "../../presentation/Banner/Banner";

import * as selectors from "../../../selectors/root.selectors";
import Loader from "../../presentation/Loader/Loader";

interface IStoreProps {
  isLoading: boolean;
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
    const { children, className, isLoading } = this.props;
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
      </article>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isLoading: selectors.getPageIsLoading(state)
});

export default injectIntl<any>(connect<IStoreProps>(mapStateToProps)(Shell));
