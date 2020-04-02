import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import { IError } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import Banner from "../../presentation/Banner/Banner";
import ErrorPage from "../../presentation/ErrorPage/ErrorPage";
import Loader from "../../presentation/Loader/Loader";
import ToastContainer from "../../presentation/ToastContainer/ToastContainer";

import "./Page.scss";

interface IProps extends WrappedComponentProps {
  children: React.ReactNode;
  className?: string;
  error?: IError;
  isLoading: boolean;
}

const Page: React.FC<IProps> = ({
  children,
  className,
  error,
  intl,
  isLoading,
}) => (
  <article className={cn("Page", { isLoading }, className)}>
    <Head>
      <meta
        content={intl.formatMessage({ id: "BRAND_NAME" })}
        property="og:site_name"
      />
    </Head>

    <Banner />

    <main className="Page--body" role="main">
      {isLoading ? (
        <Loader className="PageLoader" />
      ) : error ? (
        <ErrorPage {...error} />
      ) : (
        children
      )}
    </main>

    <ToastContainer />
  </article>
);

const mapState = (state: TStoreState) => ({
  error: selectors.getAppError(state),
  isLoading: selectors.isAppLoading(state),
});

export default injectIntl(connect(mapState)(Page));
