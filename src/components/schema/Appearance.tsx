import * as React from "react";
import { InjectedIntl, injectIntl } from "react-intl";

import { absUrl } from "../../transformers/transformData";
import Schema from "./Schema";

interface IProps extends IAppearance {
  intl: InjectedIntl;
}

const Appearance: React.SFC<IProps> = ({ intl, ...props }) =>
  (
    <Schema
      {...{
        "@id": absUrl(`/appearances/${props.slug}`),
        "@type": props.type,
        description: props.description,
        doorTime: new Date(props.startingAt).toLocaleTimeString(intl.locale),
        endDate: props.finishingAt,
        eventStatus: props.status,
        image: props.imageUrl,
        location: {
          "@type": props.location.type,
          address: props.location.address,
          name: props.location.name,
          sameAs: props.location.url
        },
        name: props.title,
        offers: props.sales.map(offer => ({
          "@type": "Offer",
          availability: offer.availability,
          name: offer.name,
          price: offer.price,
          priceCurrency: offer.priceCurrency,
          url: offer.url,
          validFrom: offer.validFrom
        })),
        organizer: {
          "@type": props.organizer.type || "Organization",
          email: props.organizer.email,
          logo: !props.organizer.logo
            ? undefined
            : {
                "@type": "ImageObject",
                url: props.organizer.logo
              },
          name: props.organizer.name
        },
        performer: props.acts.map(performer => ({
          "@type": performer.type || "MusicGroup",
          genre: performer.genre,
          image: {
            "@type": "ImageObject",
            url: performer.imageUrl
          },
          location: {
            "@type": performer.location.type,
            name: performer.location.name
          },
          name: performer.name,
          url: performer.url
        })),
        startDate: props.startingAt,
        typicalAgeRange: props.audience,
        url: absUrl(`/appearances/${props.slug}`)
      }}
    />
  ) as React.ReactElement<any>;

export default injectIntl<any>(Appearance);
