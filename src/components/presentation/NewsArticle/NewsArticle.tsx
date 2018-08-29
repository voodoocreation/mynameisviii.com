import cn from "classnames";
import * as React from "react";
import { MdAccessTime } from "react-icons/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/NewsArticle";
import ButtonBar from "../ButtonBar/ButtonBar";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import PageHeader from "../PageHeader/PageHeader";
import Type from "../Type/Type";

interface IProps extends INewsArticle {
  intl: InjectedIntl;
}

class NewsArticle extends React.Component<IProps> {
  public readonly state = {
    isImageLoaded: false
  };

  public render() {
    const { intl, ...article } = this.props;

    let action = null;

    if (article.action && article.action.route) {
      action = (
        <Link className="Button" route={article.action.route} prefetch={true}>
          {article.action.text}
        </Link>
      );
    } else if (article.action && article.action.url) {
      action = (
        <Link className="Button" href={article.action.url} isExternal={true}>
          {article.action.text}
        </Link>
      );
    }

    return (
      <article
        className={cn("NewsArticle", { isRendered: this.state.isImageLoaded })}
      >
        <PageHeader>{article.title}</PageHeader>

        <div className="NewsArticle-body">
          <Image
            alt={article.title}
            className="NewsArticle-image"
            onLoad={this.onImageLoad}
            src={article.imageUrl}
          />

          <section className="NewsArticle-meta">
            <div className="NewsArticle-posted">
              <MdAccessTime /> <FormattedMessage id="POSTED" />{" "}
              <DateTime value={article.createdAt} updateInterval={300000} />{" "}
              <FormattedMessage id="BY" /> {article.author}
            </div>

            <Type value={article.type} />
          </section>

          <section className="NewsArticle-content">
            <div
              className="NewsArticle-contentText"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <ButtonBar className="NewsArticle-action">{action}</ButtonBar>
          </section>
        </div>

        <Schema {...article} />
      </article>
    );
  }

  private onImageLoad = () => {
    this.setState({
      isImageLoaded: true
    });
  };
}

export default injectIntl<any>(NewsArticle);
