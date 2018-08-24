import cn from "classnames";
import * as React from "react";
import { Marker } from "react-google-maps";
import {
  MdAccessTime,
  MdDateRange,
  MdPeople,
  MdPlace
} from "react-icons/lib/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/Appearance";
import ActListing from "../ActListing/ActListing";
import DateTime from "../DateTime/DateTime";
import Gallery from "../Gallery/Gallery";
import Image from "../Image/Image";
import Loader from "../Loader/Loader";
import Map from "../Map/Map";
import Meta from "../Meta/Meta";
import MetaBar from "../MetaBar/MetaBar";
import PageHeader from "../PageHeader/PageHeader";
import SaleListing from "../SaleListing/SaleListing";

interface IProps extends IAppearance {
  intl: InjectedIntl;
  locationLatLng?: ILatLng;
  onGalleryInteraction?: (type: string, index?: number) => void;
}

interface IState {
  isImageLoaded: boolean;
}

class Appearance extends React.Component<IProps, IState> {
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
    const {
      intl,
      locationLatLng,
      onGalleryInteraction,
      ...appearance
    } = this.props;

    const isCancelled = appearance.status === "EventCancelled";
    const isPostponed = appearance.status === "EventPostponed";
    const isFinished = appearance.finishingAt < new Date().toISOString();

    return (
      <article
        className={cn(
          "Appearance",
          { isCancelled },
          { isPostponed },
          { isFinished }
        )}
      >
        <PageHeader>{appearance.title}</PageHeader>

        <MetaBar className="Appearance-meta">
          <Meta
            className="Appearance-date"
            icon={<MdDateRange />}
            labelConstant="DATE"
          >
            <DateTime
              isDateOnly={true}
              isRelative={false}
              options={{
                day: "numeric",
                month: "long",
                weekday: "long",
                year: "numeric"
              }}
              value={appearance.startingAt}
            />
          </Meta>

          <Meta
            className="Appearance-time"
            icon={<MdAccessTime />}
            labelConstant="TIME"
          >
            <DateTime
              isRelative={false}
              options={{
                hour: "numeric",
                hour12: true,
                minute: "numeric"
              }}
              value={appearance.startingAt}
            />
            –
            <DateTime
              isRelative={false}
              options={{
                hour: "numeric",
                hour12: true,
                minute: "numeric"
              }}
              value={appearance.finishingAt}
            />
          </Meta>

          <Meta
            className="Appearance-location"
            icon={<MdPlace />}
            labelConstant="LOCATION"
            title={`${appearance.location.name} - ${
              appearance.location.address
            }`}
          >
            {appearance.location.name}
          </Meta>

          {appearance.audience ? (
            <Meta
              className="Appearance-audience"
              icon={<MdPeople />}
              labelConstant="AUDIENCE"
            >
              {appearance.audience}
            </Meta>
          ) : null}
        </MetaBar>

        <div className="Appearance-body">
          <figure
            className={cn("Appearance-image", {
              isLoading: !this.state.isImageLoaded
            })}
          >
            <img
              onLoad={this.onImageLoad}
              onError={this.onImageLoad}
              ref={this.imageRef}
              src={appearance.imageUrl}
              title={appearance.title}
            />
            {appearance.status === "EventCancelled" ? (
              <Meta className="Appearance-status" labelConstant="STATUS">
                <FormattedMessage id="CANCELLED" />
              </Meta>
            ) : null}
            {appearance.status === "EventPostponed" ? (
              <Meta className="Appearance-status" labelConstant="POSTPONED">
                <FormattedMessage id="POSTPONED" />
              </Meta>
            ) : null}
            {!this.state.isImageLoaded ? <Loader /> : null}
          </figure>

          <div className="Appearance-details">
            <section className="Appearance-description">
              <p>{appearance.description}</p>
            </section>

            <section className="Appearance-acts">
              <h2>
                <FormattedMessage id="FEATURED_ACTS" />
              </h2>

              <div className="Appearance-acts-items">
                {appearance.acts.map(act => (
                  <ActListing key={act.name} {...act} />
                ))}
              </div>
            </section>

            {appearance.sales.length === 0 ||
            isCancelled ||
            isPostponed ||
            isFinished ? null : (
              <section className="Appearance-tickets">
                <h2>
                  <FormattedMessage id="GET_TICKETS" />
                </h2>

                <div className="Appearance-tickets-items">
                  {appearance.sales.map(sale => (
                    <SaleListing key={sale.name} {...sale} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {appearance.images.length > 0 ? (
            <section className="Appearance-images">
              <h2>
                <FormattedMessage id="PHOTOS" />
              </h2>

              <Gallery
                className="Appearance-images-items"
                onItemClick={this.onGalleryInteraction("itemClick")}
                onNext={this.onGalleryInteraction("next")}
                onPrevious={this.onGalleryInteraction("previous")}
                onModalClose={this.onGalleryInteraction("modalClose")}
              >
                {appearance.images.map(image => (
                  <Image
                    alt={image.title}
                    caption={image.title}
                    key={image.imageUrl}
                    src={image.imageUrl}
                  />
                ))}
              </Gallery>
            </section>
          ) : null}

          {!!locationLatLng ? (
            <section className="Appearance-map">
              <h2>
                <FormattedMessage id="LOCATION" />
              </h2>

              <Map
                className="Appearance-map-googleMap"
                defaultCenter={locationLatLng}
                defaultOptions={{
                  disableDefaultUI: true,
                  zoomControl: true
                }}
              >
                <Marker position={locationLatLng} />
              </Map>
            </section>
          ) : null}
        </div>

        <Schema {...appearance} />
      </article>
    );
  }

  private onImageLoad = () => {
    this.setState({
      isImageLoaded: true
    });
  };

  private onGalleryInteraction = (type: string) => (index?: number) => {
    if (this.props.onGalleryInteraction) {
      this.props.onGalleryInteraction(type, index);
    }
  };
}

export default injectIntl<any>(Appearance);
