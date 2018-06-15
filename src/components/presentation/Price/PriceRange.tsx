import * as React from "react";

import Price from "./Price";

interface IProps {
  max?: {
    price: number;
    priceCurrency?: string;
  };
  min?: {
    price: number;
    priceCurrency?: string;
  };
}

const PriceRange: React.SFC<IProps> = ({ max, min }) => (
  <React.Fragment>
    {min ? (
      <Price
        className="PriceRange-min"
        value={min.price}
        currency={min.priceCurrency}
      />
    ) : null}
    {max ? "–" : null}
    {max ? (
      <Price
        className="PriceRange-max"
        value={max.price}
        currency={max.priceCurrency}
      />
    ) : null}
  </React.Fragment>
);

export default PriceRange;
