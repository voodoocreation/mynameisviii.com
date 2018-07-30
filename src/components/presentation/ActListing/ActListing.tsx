import cn from "classnames";
import * as React from "react";
import { MdLocationOn, MdMusicNote } from "react-icons/md";

import Link from "../Link/Link";
import Meta from "../Meta/Meta";

interface IState {
  isRendered: boolean;
}

interface IProps extends IPerformer {
  onLoad?: (name: string) => void;
}

export default class ActListing extends React.Component<IProps, IState> {
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
    const { onLoad, ...act } = this.props;
    const { isRendered } = this.state;

    return (
      <article className={cn("ActListing", { isRendered })}>
        <Link className="ActListing-link" href={act.url} isExternal={true}>
          <div className="ActListing-details">
            <h3>{act.name}</h3>

            <section className="ActListing-meta">
              <Meta
                className="ActListing-genre"
                icon={<MdMusicNote />}
                labelConstant="GENRE"
              >
                {act.genre}
              </Meta>

              <Meta
                className="ActListing-location"
                icon={<MdLocationOn />}
                labelConstant="LOCATION"
              >
                {act.location.name}
              </Meta>
            </section>
          </div>
          <figure className="ActListing-image">
            <img
              src={act.imageUrl}
              alt={act.name}
              ref={this.imageRef}
              onLoad={this.onLoad}
              onError={this.onLoad}
            />
          </figure>
        </Link>
      </article>
    );
  }

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad(this.props.name);
    }
  };
}
