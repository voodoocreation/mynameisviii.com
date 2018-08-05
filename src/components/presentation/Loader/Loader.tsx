import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
}

const Loader: React.SFC<IProps> = ({ className }) => (
  <span className={cn("Loader", className)}>
    <div className="Loader-animation">
      <span />
      <span />
      <span />
    </div>
  </span>
);

export default Loader;
