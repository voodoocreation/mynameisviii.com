import cn from "classnames";
import * as React from "react";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from "react-intl";

import messages from "../../../locales/en-NZ";

import "./Meta.scss";

interface IProps extends WrappedComponentProps {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  labelIntlId?: keyof typeof messages;
  title?: string;
}

const Meta: React.FC<IProps> = ({
  children,
  className,
  icon,
  label,
  labelIntlId,
  title,
}) => (
  <div className={cn("Meta", className)} title={title}>
    {icon}{" "}
    {labelIntlId || label ? (
      <span className="Meta--label">
        {labelIntlId ? <FormattedMessage id={labelIntlId} /> : label}:
      </span>
    ) : null}{" "}
    <span className="Meta--value">{children}</span>
  </div>
);

export default injectIntl(Meta);
