import cn from "classnames";
import * as React from "react";

import Loader from "../Loader/Loader";

interface IProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit";
  onClick: () => void;
}

export default class Button extends React.Component<IProps> {
  public static defaultProps = {
    isDisabled: false,
    isLoading: false,
    type: "button"
  };

  public buttonNode: HTMLButtonElement | null = null;

  public shouldComponentUpdate(nextProps: IProps) {
    return (
      nextProps.isDisabled !== this.props.isDisabled ||
      nextProps.isLoading !== this.props.isLoading
    );
  }

  public render() {
    const {
      children,
      className,
      isDisabled,
      isLoading,
      onClick,
      type
    } = this.props;

    return (
      <button
        className={cn("Button", className, { isLoading })}
        disabled={isDisabled}
        onClick={!isLoading ? onClick : undefined}
        ref={el => (this.buttonNode = el)}
        type={type}
      >
        <span className="Button-content">{children}</span>
        {isLoading ? <Loader /> : null}
      </button>
    );
  }
}
