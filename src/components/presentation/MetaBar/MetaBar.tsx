import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
}

const MetaBar: React.SFC<IProps> = ({ children, className }) =>
  !children ? null : <div className={cn("MetaBar", className)}>{children}</div>;

export default MetaBar;
