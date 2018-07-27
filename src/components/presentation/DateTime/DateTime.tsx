import cn from "classnames";
import moment from "moment";
import * as React from "react";
import { FormattedRelative, InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  className?: string;
  intl: InjectedIntl;
  isDateOnly?: boolean;
  isRelative?: boolean;
  options?: Intl.DateTimeFormatOptions;
  updateInterval?: number;
  value: string;
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
    dateTime={value}
    title={
      isDateOnly
        ? intl.formatDate(moment(value).toDate(), options)
        : intl.formatTime(moment(value).toDate(), options)
    }
  >
    {isRelative ? (
      <FormattedRelative
        updateInterval={updateInterval}
        value={moment(value).toDate()}
        {...props}
      />
    ) : isDateOnly ? (
      intl.formatDate(moment(value).toDate(), options)
    ) : (
      intl.formatTime(moment(value).toDate(), options)
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
