import cn from "classnames";
import * as React from "react";

import "./NoResults.scss";

interface IProps {
  className?: string;
}

const NoResults: React.FC<IProps> = ({ children, className }) => (
  <div className={cn("NoResults", className)}>{children}</div>
);

export default NoResults;
