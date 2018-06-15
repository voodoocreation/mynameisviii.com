import cn from "classnames";
import * as React from "react";

import Schema from "../../schema/NewsArticle";
import Link from "../Link/Link";
import Type from "../Type/Type";

interface IState {
  isRendered: boolean;
}

interface IProps extends INewsArticle {
  isCondensed?: boolean;
  onLoad?: (slug: string) => void;
}

export default class NewsListing extends React.Component<IProps, IState> {
  public static defaultProps = {
    isCondensed: false
  };

  public readonly state = {
    isRendered: false
  };

  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onLoad, 1);
    }
  }

  public render() {
    const { isCondensed, onLoad, ...article } = this.props;

    const header = isCondensed ? (
      <h3>
        <Type value={article.type} hasLabel={false} />
        <span>{article.title}</span>
      </h3>
    ) : (
      <h2>
        <Type value={article.type} hasLabel={false} />
        <span>{article.title}</span>
      </h2>
    );

    return (
      <article
        className={cn(
          "NewsListing",
          { isCondensed },
          { isRendered: this.state.isRendered }
        )}
      >
        <Link route={`/news/${article.slug}`}>
          <header className="NewsListing-header">{header}</header>

          <img
            alt={article.title}
            onError={this.onLoad}
            onLoad={this.onLoad}
            ref={this.imageRef}
            src={article.imageUrl}
          />

          <p>
            <span>{article.excerpt}</span>
          </p>
        </Link>

        <Schema {...article} />
      </article>
    );
  }

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad(this.props.slug);
    }
  };
}
