import Head from "next/head";
import * as React from "react";
import { MdErrorOutline } from "react-icons/md";
import { InjectedIntl, injectIntl } from "react-intl";

import { absUrl } from "../../../transformers/transformData";
import PageHeader from "../../presentation/PageHeader/PageHeader";

interface IProps {
  intl: InjectedIntl;
  message?: string;
  status: number;
}

class ErrorPage extends React.Component<IProps> {
  public static defaultProps = {
    status: 500
  };

  public render() {
    const { formatMessage } = this.props.intl;

    return (
      <React.Fragment>
        <Head>
          <title>
            {`${this.getTitle()} · ${formatMessage({
              id: "BRAND_NAME"
            })}`}
          </title>

          <meta content={this.getMessage()} name="description" />
          <meta property="og:title" content={this.getTitle()} />
          <meta property="og:description" content={this.getMessage()} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/error-og.jpg"
          />
          <meta property="og:url" content={absUrl("/symbol")} />
        </Head>

        <article className="ErrorPage">
          <PageHeader>{this.getTitle()}</PageHeader>

          <div className="ErrorPage-content">
            <MdErrorOutline />
            <p>{this.getMessage()}</p>
          </div>
        </article>
      </React.Fragment>
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
        return message ? message : formatMessage({ id: "ERROR_MESSAGE" });

      case 404:
        return formatMessage({ id: "ERROR_404_MESSAGE" });
    }
  }
}

export default injectIntl<any>(ErrorPage);
