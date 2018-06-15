import cn from "classnames";
import * as React from "react";
import { FormattedNumber, InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  className?: string;
  currency?: string;
  currencyDisplay?: string;
  intl: InjectedIntl;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  value: number;
}

const Price: React.SFC<IProps> = ({
  className,
  currency,
  currencyDisplay,
  minimumIntegerDigits,
  minimumFractionDigits,
  maximumFractionDigits,
  minimumSignificantDigits,
  maximumSignificantDigits,
  value
}) => (
  <span className={cn("Price", className)}>
    <FormattedNumber
      currency={currency}
      currencyDisplay={currencyDisplay}
      style="currency"
      minimumIntegerDigits={minimumIntegerDigits}
      minimumFractionDigits={minimumFractionDigits}
      maximumFractionDigits={maximumFractionDigits}
      minimumSignificantDigits={minimumSignificantDigits}
      maximumSignificantDigits={maximumSignificantDigits}
      value={value}
    />
  </span>
);

Price.defaultProps = {
  currency: "NZD",
  currencyDisplay: "symbol",
  minimumFractionDigits: 0
};

export default injectIntl<any>(Price);
