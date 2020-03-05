import Head from "next/head";
import * as React from "react";
import { MdErrorOutline } from "react-icons/md";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import PageHeader from "../PageHeader/PageHeader";

import "./ErrorPage.scss";

interface IProps extends WrappedComponentProps {
  message?: string;
  status?: number;
}

class ErrorPage extends React.Component<IProps> {
  public static defaultProps = {
    status: 500
  };

  public render() {
    const { formatMessage } = this.props.intl;

    return (
      <>
        <Head>
          <title>
            {`${this.getTitle()} · ${formatMessage({
              id: "BRAND_NAME"
            })}`}
          </title>

          <meta content={this.getMessage()} name="description" />
          <meta content={this.getTitle()} property="og:title" />
          <meta content={this.getMessage()} property="og:description" />
          <meta content="website" property="og:type" />
          <meta content={s3ThemeUrl("/og/error.jpg")} property="og:image" />
          <meta content={absoluteUrl("/symbol")} property="og:url" />
        </Head>

        <article className="ErrorPage">
          <PageHeader>{this.getTitle()}</PageHeader>

          <div className="ErrorPage--content">
            <MdErrorOutline />
            <p>{this.getMessage()}</p>
          </div>
        </article>
      </>
    );
  }

  private getTitle() {
    const { status } = this.props;
    const { formatMessage } = this.props.intl;

    switch (status) {
      default:
        return formatMessage({ id: "ERROR_TITLE" });

      case 404:
        return formatMessage({ id: "ERROR_404_TITLE" });
    }
  }

  private getMessage() {
    const { message, status } = this.props;
    const { formatMessage } = this.props.intl;

    switch (status) {
      default:
        return message || formatMessage({ id: "ERROR_MESSAGE" });

      case 404:
        return formatMessage({ id: "ERROR_404_MESSAGE" });
    }
  }
}

export default injectIntl(ErrorPage);
