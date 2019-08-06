import * as React from "react";

import { absUrl } from "../../helpers/dataTransformers";
import { INewsArticle, organization } from "../../models/root.models";
import Schema from "./Schema";

const publisher = organization({
  email: "mgmt@mynameisviii.com",
  logo:
    "https://s3.amazonaws.com/mynameisviii-static/voodoo-creation-records-logo.png",
  name: "Voodoo Creation Records"
});

const NewsArticle: React.FC<INewsArticle> = props => (
  <Schema
    {...{
      "@id": absUrl(`/news/${props.slug}`),
      "@type": "NewsArticle",
      articleBody: props.content,
      author: {
        "@type": "Person",
        name: props.author
      },
      dateModified: props.createdAt,
      datePublished: props.createdAt,
      description: props.excerpt,
      headline: props.title,
      image: props.imageUrl,
      mainEntityOfPage: {
        "@id": absUrl(`/news/${props.slug}`)
      },
      name: props.title,
      publisher: {
        "@type": publisher.type,
        email: publisher.email,
        logo: {
          "@type": "ImageObject",
          url: publisher.logo
        }
      },
      text: props.content,
      thumbnailUrl: props.ogImageUrl
    }}
  />
);

export default NewsArticle;
