import cn from "classnames";
import * as React from "react";
import { MdAccessTime } from "react-icons/lib/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/NewsArticle";
import ButtonBar from "../ButtonBar/ButtonBar";
import DateTime from "../DateTime/DateTime";
import Link from "../Link/Link";
import Loader from "../Loader/Loader";
import PageHeader from "../PageHeader/PageHeader";
import Type from "../Type/Type";

interface IProps extends INewsArticle {
  intl: InjectedIntl;
}

class NewsArticle extends React.Component<IProps> {
  public readonly state = {
    isImageLoaded: false
  };

  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onImageLoad, 1);
    }
  }

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
      <article className="NewsArticle">
        <PageHeader>{article.title}</PageHeader>

        <div className="NewsArticle-body">
          <figure
            className={cn("NewsArticle-image", {
              isLoading: !this.state.isImageLoaded
            })}
          >
            <img
              onLoad={this.onImageLoad}
              onError={this.onImageLoad}
              ref={this.imageRef}
              src={article.imageUrl}
              title={article.title}
            />
            {!this.state.isImageLoaded ? <Loader /> : null}
          </figure>

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
