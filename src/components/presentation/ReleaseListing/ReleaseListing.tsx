import cn from "classnames";
import * as React from "react";
import {
  MdAccessTime,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/Release";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

interface IState {
  isRendered: boolean;
}

interface IProps extends IRelease {
  intl: InjectedIntl;
  onLoad?: (slug: string) => void;
}

class ReleaseListing extends React.Component<IProps, IState> {
  public state = {
    isRendered: false
  };

  public render() {
    const { intl, onLoad, ...release } = this.props;
    const { isRendered } = this.state;

    const trackCount = release.tracklist.reduce((acc, curr) => {
      acc += curr.length;
      return acc;
    }, 0);

    return (
      <article className={cn("ReleaseListing", { isRendered })}>
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
                {trackCount}{" "}
                {trackCount === 1 ? (
                  <FormattedMessage id="TRACK" />
                ) : (
                  <FormattedMessage id="TRACKS" />
                )}
              </Meta>
            </section>
          </div>

          <Image
            className="ReleaseListing-image"
            alt={release.title}
            onLoad={this.onLoad}
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

export default injectIntl<any>(ReleaseListing);
