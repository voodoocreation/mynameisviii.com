import * as React from "react";

import Schema from "../../schema/Gallery";
import Image from "../Image/Image";
import ImageGallery from "../ImageGallery/ImageGallery";
import PageHeader from "../PageHeader/PageHeader";

const Gallery: React.SFC<IGallery> = gallery =>
  (
    <article className="Gallery">
      <PageHeader>{gallery.title}</PageHeader>

      <div className="Gallery-description">
        <p>{gallery.description}</p>
      </div>

      <section className="Gallery-images">
        <ImageGallery>
          {!gallery.images
            ? null
            : gallery.images.map(image => (
                <Image
                  alt={gallery.title}
                  className="Gallery-image"
                  key={image.imageUrl}
                  src={image.imageUrl}
                />
              ))}
        </ImageGallery>
      </section>

      <Schema {...gallery} />
    </article>
  ) as React.ReactElement<any>;

export default Gallery;
