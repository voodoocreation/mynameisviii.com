import cn from "classnames";
import * as React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  icon?: React.ReactNode;
  intl: InjectedIntl;
  label?: React.ReactNode;
  labelConstant?: string;
  title?: string;
}

const Meta: React.SFC<IProps> = ({
  children,
  className,
  icon,
  label,
  labelConstant,
  title
}) => (
  <div className={cn("Meta", className)} title={title}>
    {icon}{" "}
    {labelConstant || label ? (
      <span className="Meta-label">
        {labelConstant ? <FormattedMessage id={labelConstant} /> : label}:
      </span>
    ) : null}{" "}
    <span className="Meta-value">{children}</span>
  </div>
);

export default injectIntl<any>(Meta);
