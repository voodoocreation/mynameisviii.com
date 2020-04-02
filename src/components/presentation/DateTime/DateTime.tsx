import { selectUnit } from "@formatjs/intl-utils";
import cn from "classnames";
import dayjs from "dayjs";
import * as React from "react";
import {
  FormattedDate,
  FormattedRelativeTime,
  FormattedTime,
  injectIntl,
  WrappedComponentProps,
} from "react-intl";

interface IProps extends WrappedComponentProps {
  className?: string;
  isDateOnly?: boolean;
  isRelative?: boolean;
  options?: Intl.DateTimeFormatOptions;
  updateInterval?: number;
  value: Date | string | number;
}

const DateTime: React.FC<IProps> = ({
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
    {...props}
    className={cn("DateTime", className)}
    dateTime={
      isDateOnly
        ? dayjs(value).format("YYYY-MM-DD")
        : dayjs(value).format("YYYY-MM-DDTHH:mm:ss")
    }
    title={
      isDateOnly
        ? intl.formatDate(value, options)
        : intl.formatTime(value, options)
    }
  >
    {isRelative ? (
      <FormattedRelativeTime
        numeric="auto"
        {...selectUnit(dayjs(value).toDate())}
      />
    ) : isDateOnly ? (
      <FormattedDate value={value} {...options} />
    ) : (
      <FormattedTime value={value} {...options} />
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
    year: "numeric",
  },
  updateInterval: 300,
};

export default injectIntl(DateTime);
