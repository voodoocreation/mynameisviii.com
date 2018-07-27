import * as React from "react";
import * as ReactDOM from "react-dom";
import { isServer } from "../../../helpers/dom";

interface IProps {
  className?: string;
  isRenderingInPlace?: boolean;
}

export default class Portal extends React.Component<IProps> {
  public static defaultProps = {
    isRenderingInPlace: false
  };

  private container: HTMLDivElement | undefined = !isServer()
    ? document.createElement("div")
    : undefined;

  public componentDidMount() {
    if (!isServer() && this.container) {
      if (this.props.className) {
        this.container.classList.add(this.props.className);
      }

      const portal = document.querySelector(".Portal");

      if (portal) {
        portal.appendChild(this.container);
      }
    }
  }

  public componentWillUnmount() {
    if (!isServer() && this.container) {
      const portal = document.querySelector(".Portal");

      if (portal) {
        portal.removeChild(this.container);
      }
    }
  }

  public render() {
    if (!this.container || this.props.isRenderingInPlace) {
      return <div className="Portal-inPlace">{this.props.children}</div>;
    }

    return ReactDOM.createPortal(this.props.children, this.container);
  }
}