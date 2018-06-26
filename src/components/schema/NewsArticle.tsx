import * as React from "react";

import organisation from "../../../server/mocks/organisation.json";
import { absUrl } from "../../transformers/transformData";
import Schema from "./Schema";

const NewsArticle: React.SFC<INewsArticle> = props => (
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
      publisher: organisation,
      text: props.content,
      thumbnailUrl: props.ogImageUrl
    }}
  />
);

export default NewsArticle;
