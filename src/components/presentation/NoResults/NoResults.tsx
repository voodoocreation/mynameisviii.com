import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
}

const NoResults: React.SFC<IProps> = ({ children, className }) =>
  (
    <div className={cn("NoResults", className)}>{children}</div>
  ) as React.ReactElement<any>;

export default NoResults;
