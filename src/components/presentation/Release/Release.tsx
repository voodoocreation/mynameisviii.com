import cn from "classnames";
import * as React from "react";
import {
  MdAccessTime,
  MdAlbum,
  MdDateRange,
  MdFormatListNumbered,
  MdMusicNote
} from "react-icons/lib/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/Release";
import Carousel from "../Carousel/Carousel";
import DateTime from "../DateTime/DateTime";
import Link from "../Link/Link";
import Loader from "../Loader/Loader";
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

  private imageRefs: HTMLImageElement[] = [];

  public componentDidMount() {
    this.imageRefs.forEach((imageRef, index) => {
      if (imageRef.complete) {
        setTimeout(this.onImageLoad(index), 1);
      }
    });
  }

  public render() {
    const { intl, onCarouselSlideChange, ...release } = this.props;

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
            {release.tracklist.length}{" "}
            {release.tracklist.length === 1 ? (
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

              <ol>{release.tracklist.map(this.renderTrack)}</ol>
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

  private setImageRef = (index: number) => (image: HTMLImageElement) => {
    this.imageRefs[index] = image;
  };

  private renderImage = (image: IImage, index: number) => (
    <figure
      key={image.imageUrl}
      className={cn({ isLoading: !this.state.loadedImages[index] })}
    >
      <img
        alt={image.title}
        onError={this.onImageLoad(index)}
        onLoad={this.onImageLoad(index)}
        ref={this.setImageRef(index)}
        src={image.imageUrl}
      />
      {!this.state.loadedImages[index] ? <Loader /> : null}
      <figcaption>{image.title}</figcaption>
    </figure>
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
