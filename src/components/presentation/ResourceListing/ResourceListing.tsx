import cn from "classnames";
import * as React from "react";

import Image from "../Image/Image";
import Link from "../Link/Link";

interface IProps extends IResource {
  onLoad: (slug: string) => void;
}

interface IState {
  isRendered: boolean;
}

class ResourceListing extends React.Component<IProps, IState> {
  public state = {
    isRendered: false
  };

  public render() {
    const { onLoad, ...resource } = this.props;
    const { isRendered } = this.state;

    return (
      <article className={cn("ResourceListing", { isRendered })}>
        <Link href={resource.url} isExternal={true}>
          <Image
            className="ResourceListing-image"
            alt={resource.title}
            src={resource.imageUrl}
            onLoad={this.onLoad}
          />

          <div className="ResourceListing-details">
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
          </div>
        </Link>
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

export default ResourceListing;
