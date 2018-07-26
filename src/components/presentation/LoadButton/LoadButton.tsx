import cn from "classnames";
import * as React from "react";

import { isAlmostInViewport, isServer } from "../../../helpers/dom";
import Button from "../Button/Button";

interface IProps {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isScrollLoadEnabled?: boolean;
  onLoad: () => void;
  triggerDistance?: number;
}

export default class LoadButton extends React.Component<IProps> {
  public static defaultProps = {
    isDisabled: false,
    isLoading: false,
    isScrollLoadEnabled: true,
    triggerDistance: 50
  };

  private buttonRef: React.RefObject<Button> = React.createRef();

  public componentWillMount() {
    if (!isServer() && this.props.isScrollLoadEnabled) {
      window.addEventListener("scroll", this.onWindowScroll);
    }
  }

  public componentDidMount() {
    this.tryLoad();
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (!isServer()) {
      if (!this.props.isScrollLoadEnabled && nextProps.isScrollLoadEnabled) {
        window.addEventListener("scroll", this.onWindowScroll);
      }

      if (this.props.isScrollLoadEnabled && !nextProps.isScrollLoadEnabled) {
        window.removeEventListener("scroll", this.onWindowScroll);
      }
    }
  }

  public componentDidUpdate() {
    this.tryLoad();
  }

  public componentWillUnmount() {
    if (!isServer() && this.props.isScrollLoadEnabled) {
      window.removeEventListener("scroll", this.onWindowScroll);
    }
  }

  public render() {
    const { children, className, isLoading, ...props } = this.props;

    return (
      <Button
        {...props}
        className={cn("LoadButton", className)}
        isLoading={isLoading}
        onClick={this.onClick}
        ref={this.buttonRef}
      >
        {children}
      </Button>
    );
  }

  private tryLoad = () => {
    if (
      this.props.isScrollLoadEnabled &&
      !this.props.isDisabled &&
      !this.props.isLoading &&
      this.buttonRef.current &&
      isAlmostInViewport(
        this.buttonRef.current.buttonNode,
        this.props.triggerDistance
      )
    ) {
      this.props.onLoad();
    }
  };

  private onWindowScroll = () => {
    this.tryLoad();
  };

  private onClick = () => {
    this.props.onLoad();
  };
}
