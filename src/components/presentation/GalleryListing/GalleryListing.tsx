import cn from "classnames";
import * as React from "react";

import Schema from "../../schema/Gallery";
import Image from "../Image/Image";
import Link from "../Link/Link";

interface IState {
  isRendered: boolean;
}

interface IProps extends IGallery {
  onLoad?: (slug: string) => void;
}

export default class GalleryListing extends React.Component<IProps, IState> {
  public readonly state = {
    isRendered: false
  };

  public componentDidMount() {
    if (!this.props.imageUrl) {
      this.onLoad();
    }
  }

  public render() {
    const { onLoad, ...gallery } = this.props;
    const { isRendered } = this.state;

    return (
      <article className={cn("GalleryListing", { isRendered })}>
        <Link route={`/galleries/${gallery.slug}`}>
          <header className="GalleryListing-header">
            <h2>{gallery.title}</h2>
          </header>

          {!gallery.imageUrl ? null : (
            <Image
              alt={gallery.title}
              className="GalleryListing-image"
              onLoad={this.onLoad}
              src={gallery.imageUrl}
            />
          )}
        </Link>

        <Schema {...gallery} />
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
