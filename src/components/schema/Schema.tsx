import * as React from "react";

interface IProps {
  [index: string]: any;
  "@context"?: string;
  "@type"?: string;
  isPretty?: boolean;
}

const Schema: React.FC<IProps> = ({ isPretty, ...props }) => (
  <script
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(props, null, isPretty ? "  " : undefined),
    }}
    type="application/ld+json"
  />
);

Schema.defaultProps = {
  "@context": "http://schema.org/",
  "@type": "Thing",
  isPretty: false,
};

export default Schema;
