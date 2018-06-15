import cn from "classnames";
import * as React from "react";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

const ButtonBar: React.SFC<IProps> = ({ children, className }) =>
  !children ? null : (
    <div className={cn("ButtonBar", className)}>{children}</div>
  );

export default ButtonBar;
