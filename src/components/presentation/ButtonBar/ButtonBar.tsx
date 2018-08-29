import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
}

const ButtonBar: React.SFC<IProps> = ({ children, className }) =>
  !children
    ? null
    : ((
        <div className={cn("ButtonBar", className)}>{children}</div>
      ) as React.ReactElement<any>);

export default ButtonBar;
