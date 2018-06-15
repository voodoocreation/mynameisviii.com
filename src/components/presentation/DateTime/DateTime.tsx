import cn from "classnames";
import * as React from "react";
import { FormattedRelative, InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  className?: string;
  intl: InjectedIntl;
  isDateOnly?: boolean;
  isRelative?: boolean;
  options?: Intl.DateTimeFormatOptions;
  updateInterval?: number;
  value: Date | string | number;
}

const DateTime: React.SFC<IProps> = ({
  className,
  intl,
  isDateOnly,
  isRelative,
  options,
  updateInterval,
  value,
  ...props
}) => (
  <time
    className={cn("DateTime", className)}
    dateTime={new Date(value).toISOString()}
    title={
      isDateOnly
        ? intl.formatDate(value, options)
        : intl.formatTime(value, options)
    }
  >
    {isRelative ? (
      <FormattedRelative
        updateInterval={updateInterval}
        value={value}
        {...props}
      />
    ) : isDateOnly ? (
      intl.formatDate(value, options)
    ) : (
      intl.formatTime(value, options)
    )}
  </time>
);

DateTime.defaultProps = {
  isDateOnly: false,
  isRelative: true,
  options: {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric"
  }
};

export default injectIntl<any>(DateTime);
