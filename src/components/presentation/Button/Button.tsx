import cn from "classnames";
import * as React from "react";

import Loader from "../Loader/Loader";
import "./Button.scss";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isStyled?: boolean;
  nodeRef?: React.RefObject<HTMLButtonElement>;
}

const Button: React.FC<IProps> = ({
  children,
  className,
  isActive,
  isDisabled,
  isLoading,
  isStyled,
  nodeRef,
  onClick,
  ...props
}) => (
  // eslint-disable-next-line react/button-has-type
  <button
    className={cn(
      "Button",
      className,
      { isActive },
      { isDisabled },
      { isLoading },
      { isStyled }
    )}
    disabled={isDisabled || isLoading}
    {...props}
    ref={nodeRef}
    onClick={!isLoading ? onClick : undefined}
  >
    <span className="Button--content">{children}</span>
    {isLoading ? <Loader /> : null}
  </button>
);

Button.defaultProps = {
  isActive: false,
  isDisabled: false,
  isLoading: false,
  isStyled: false,
  type: "button"
};

export default Button;
