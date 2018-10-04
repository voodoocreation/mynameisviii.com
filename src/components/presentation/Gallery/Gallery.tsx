import * as React from "react";

import Schema from "../../schema/Gallery";
import Image from "../Image/Image";
import ImageGallery from "../ImageGallery/ImageGallery";
import PageHeader from "../PageHeader/PageHeader";

interface IProps extends IGallery {
  onGalleryInteraction?: (type: string, index?: number) => void;
}

export default class Gallery extends React.Component<IProps> {
  public render() {
    const { onGalleryInteraction, ...gallery } = this.props;

    return (
      <article className="Gallery">
        <PageHeader>{gallery.title}</PageHeader>

        <div className="Gallery-description">
          <p>{gallery.description}</p>
        </div>

        <section className="Gallery-images">
          <ImageGallery
            onItemClick={this.onGalleryInteraction("itemClick")}
            onNext={this.onGalleryInteraction("next")}
            onPrevious={this.onGalleryInteraction("previous")}
            onModalClose={this.onGalleryInteraction("modalClose")}
          >
            {!gallery.images
              ? null
              : gallery.images.map((image, index) => (
                  <Image
                    alt={`${gallery.title} - ${index + 1}`}
                    className="Gallery-image"
                    key={image.imageUrl}
                    src={image.imageUrl}
                  />
                ))}
          </ImageGallery>
        </section>

        <Schema {...gallery} />
      </article>
    );
  }

  private onGalleryInteraction = (type: string) => (index?: number) => {
    if (this.props.onGalleryInteraction) {
      this.props.onGalleryInteraction(type, index);
    }
  };
}
