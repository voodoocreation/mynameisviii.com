import cn from "classnames";
import * as React from "react";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

const Meta: React.SFC<IProps> = ({ children, className }) => (
  <div className={cn("NoResults", className)}>{children}</div>
);

export default Meta;
