import * as React from "react";
import {
  MdAccessTime,
  MdAlbum,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/Release";
import Carousel from "../Carousel/Carousel";
import DateTime from "../DateTime/DateTime";
import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import MetaBar from "../MetaBar/MetaBar";
import PageHeader from "../PageHeader/PageHeader";
import PlatformIcon from "../PlatformIcon/PlatformIcon";

interface IProps extends IRelease {
  intl: InjectedIntl;
  onCarouselSlideChange?: (index: number) => void;
}

interface IState {
  loadedImages: {
    [index: number]: boolean;
  };
}

class Release extends React.Component<IProps, IState> {
  public readonly state: IState = {
    loadedImages: {}
  };

  public render() {
    const { intl, onCarouselSlideChange, ...release } = this.props;

    const trackCount = release.tracklist.reduce((acc, curr) => {
      acc += curr.length;
      return acc;
    }, 0);

    return (
      <article className="Release">
        <PageHeader>{release.title}</PageHeader>

        <MetaBar className="Release-meta">
          <Meta
            className="Release-type"
            icon={<MdAlbum />}
            labelConstant="TYPE"
          >
            <FormattedMessage id={release.type.toUpperCase()} />
          </Meta>

          <Meta
            className="Release-releasedOn"
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
            className="Release-length"
            icon={<MdAccessTime />}
            labelConstant="LENGTH"
          >
            {release.length}
          </Meta>

          <Meta
            className="Release-genre"
            icon={<MdMusicNote />}
            labelConstant="GENRE"
          >
            {release.genre}
          </Meta>

          <Meta className="Release-tracks" icon={<MdFormatListNumbered />}>
            {trackCount}{" "}
            {trackCount === 1 ? (
              <FormattedMessage id="TRACK" />
            ) : (
              <FormattedMessage id="TRACKS" />
            )}
          </Meta>
        </MetaBar>

        <div className="Release-body">
          <section className="Release-images">
            <Carousel onSlideChange={this.onCarouselSlideChange}>
              {release.images.map(this.renderImage)}
            </Carousel>
          </section>

          <div className="Release-details">
            <section
              className="Release-description"
              dangerouslySetInnerHTML={{ __html: release.description }}
            />

            <section className="Release-tracklist">
              <h2>
                <FormattedMessage id="TRACKLIST" />
              </h2>

              {release.tracklist.map((album, albumIndex) => (
                <React.Fragment key={albumIndex}>
                  {release.tracklist.length > 1 ? (
                    <h3>
                      <FormattedMessage
                        id="DISC_NUMBER"
                        values={{ number: albumIndex }}
                      />
                    </h3>
                  ) : null}
                  <ol>{album.map(this.renderTrack)}</ol>
                </React.Fragment>
              ))}
            </section>

            {release.streamList.length > 0 ? (
              <section className="Release-streamList">
                <h2>
                  <FormattedMessage id="STREAM" />
                </h2>

                <ul className="Release-platformList">
                  {release.streamList.map(this.renderStreamLink)}
                </ul>
              </section>
            ) : null}

            {release.buyList.length > 0 ? (
              <section className="Release-buyList">
                <h2>
                  <FormattedMessage id="BUY" />
                </h2>

                <ul className="Release-platformList">
                  {release.buyList.map(this.renderBuyLink)}
                </ul>
              </section>
            ) : null}

            <section className="Release-copyright">
              <p>
                ℗© {new Date(release.releasedOn).getFullYear()}{" "}
                {release.recordLabel}
              </p>
            </section>
          </div>
        </div>

        <Schema {...this.props} />
      </article>
    );
  }

  private onImageLoad = (index: number) => () => {
    this.setState({
      loadedImages: {
        ...this.state.loadedImages,
        [index]: true
      }
    });
  };

  private renderImage = (image: IImage, index: number) => (
    <Image
      alt={image.title}
      caption={image.title}
      className="Release-image"
      key={`image-${index}`}
      onLoad={this.onImageLoad(index)}
      src={image.imageUrl}
    />
  );

  private renderTrack = (track: IReleaseTrack) => (
    <li key={track.title}>
      <span className="Release-tracklist-title">{track.title}</span>{" "}
      <span className="Release-tracklist-genre">{track.genre}</span>{" "}
      <span className="Release-tracklist-length">{track.length}</span>
    </li>
  );

  private renderBuyLink = (link: IBuyStreamLink) => (
    <li key={link.platform}>
      <Link
        href={link.url}
        isExternal={true}
        title={this.props.intl.formatMessage(
          {
            id: `BUY_FROM_${link.platform.toUpperCase()}`
          },
          {
            title: this.props.title
          }
        )}
      >
        <PlatformIcon value={link.platform} />{" "}
        <FormattedMessage id={link.platform.toUpperCase()} />
      </Link>
    </li>
  );

  private renderStreamLink = (link: IBuyStreamLink) => (
    <li key={link.platform}>
      <Link
        href={link.url}
        isExternal={true}
        title={this.props.intl.formatMessage(
          {
            id: `STREAM_ON_${link.platform.toUpperCase()}`
          },
          {
            title: this.props.title
          }
        )}
      >
        <PlatformIcon value={link.platform} />{" "}
        <FormattedMessage id={link.platform.toUpperCase()} />
      </Link>
    </li>
  );

  private onCarouselSlideChange = (index: number) => {
    if (this.props.onCarouselSlideChange) {
      this.props.onCarouselSlideChange(index);
    }
  };
}

export default injectIntl<any>(Release);
