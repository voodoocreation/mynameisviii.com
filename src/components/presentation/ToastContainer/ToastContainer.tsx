import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
}

const ToastContainer: React.SFC<IProps> = ({ children, className }) =>
  !children
    ? null
    : ((
        <div className={cn("ToastContainer", className)}>{children}</div>
      ) as React.ReactElement<any>);

export default ToastContainer;
