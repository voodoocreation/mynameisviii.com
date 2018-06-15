import cn from "classnames";
import * as React from "react";
import {
  MdAccessTime,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/lib/md";
import { FormattedMessage } from "react-intl";

import Schema from "../../schema/Release";
import DateTime from "../DateTime/DateTime";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

interface IState {
  isRendered: boolean;
}

interface IProps extends IRelease {
  onLoad?: (slug: string) => void;
}

export default class ReleaseListing extends React.Component<IProps, IState> {
  public state = {
    isRendered: false
  };

  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onLoad, 1);
    }
  }

  public render() {
    const { onLoad, ...release } = this.props;

    return (
      <article
        className={cn("ReleaseListing", { isRendered: this.state.isRendered })}
      >
        <Link route={`/releases/${release.slug}`}>
          <div className="ReleaseListing-details">
            <header className="ReleaseListing-header">
              <h3>
                <span>{release.title}</span>
              </h3>
            </header>

            <section className="ReleaseListing-meta">
              <Meta
                className="ReleaseListing-releasedOn"
                icon={<MdDateRange />}
                labelConstant="RELEASED"
              >
                <DateTime
                  isDateOnly={true}
                  isRelative={false}
                  options={{
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }}
                  value={release.releasedOn}
                />
              </Meta>

              <Meta
                className="ReleaseListing-length"
                icon={<MdAccessTime />}
                labelConstant="LENGTH"
              >
                {release.length}
              </Meta>

              <Meta
                className="ReleaseListing-genre"
                icon={<MdMusicNote />}
                labelConstant="GENRE"
              >
                {release.genre}
              </Meta>

              <Meta
                className="ReleaseListing-tracks"
                icon={<MdFormatListNumbered />}
              >
                {release.tracklist.length}{" "}
                {release.tracklist.length === 1 ? (
                  <FormattedMessage id="TRACK" />
                ) : (
                  <FormattedMessage id="TRACKS" />
                )}
              </Meta>
            </section>
          </div>

          <img
            alt={release.title}
            onError={this.onLoad}
            onLoad={this.onLoad}
            ref={this.imageRef}
            src={release.images[0].imageUrl}
          />
        </Link>

        <Schema {...release} />
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
