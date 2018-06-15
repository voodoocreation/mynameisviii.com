import * as React from "react";

interface IProps {
  "@context"?: string;
  "@type"?: string;
  isPretty?: boolean;
  [index: string]: any;
}

const Schema: React.SFC<IProps> = ({ isPretty, ...props }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(props, null, isPretty ? "  " : undefined)
    }}
  />
);

Schema.defaultProps = {
  "@context": "http://schema.org/",
  "@type": "Thing",
  isPretty: false
};

export default Schema;
