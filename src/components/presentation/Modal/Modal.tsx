import cn from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MdClose } from "react-icons/lib/md";

import { lockScroll, unlockScroll } from "../../../helpers/dom";

interface IProps {
  className?: string;
  isOpen?: boolean;
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  hasFocusRestriction?: boolean;
  hasOverlayClick?: boolean;
}

interface IState {
  isVisible: boolean;
}

export default class Modal extends React.Component<IProps, IState> {
  public static defaultProps = {
    hasFocusRestriction: true,
    hasOverlayClick: true
  };

  public readonly state = {
    isVisible: false
  };

  private container: HTMLDivElement | null = null;
  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
    this.container = document.querySelector(".Portal");

    if (this.props.isOpen) {
      this.onShow();
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.onHide();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      this.onShow();
    }
  }

  public componentWillUnmount() {
    if (this.props.isOpen) {
      this.onHide();
    }
  }

  public render() {
    return this.container && this.props.isOpen
      ? ReactDOM.createPortal(this.renderModal(), this.container)
      : null;
  }

  private renderModal() {
    const { children, className, hasOverlayClick, isOpen } = this.props;
    const { isVisible } = this.state;

    return (
      <div
        aria-hidden={!isOpen}
        aria-modal={true}
        className={cn("Modal", className, { isVisible })}
        ref={this.modalRef}
        role="dialog"
        tabIndex={isOpen ? 0 : -1}
      >
        <div
          className="Modal-overlay"
          onClick={hasOverlayClick ? this.onClose : undefined}
        />

        <div className="Modal-content">
          <div className="Modal-body">{children}</div>

          <button className="Modal-closeButton" onClick={this.onClose}>
            <MdClose />
          </button>
        </div>
      </div>
    );
  }

  private onFocus = (event: FocusEvent) => {
    if (
      this.container &&
      event.target &&
      this.props.isOpen &&
      this.props.hasFocusRestriction
    ) {
      if (
        event.target === window ||
        !this.container.contains(event.target as Node)
      ) {
        event.stopPropagation();

        if (this.modalRef.current) {
          this.modalRef.current.focus();
        }
      }
    }
  };

  private onClose = () => {
    this.props.onClose();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.onClose();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };

  private onShow = () => {
    if (this.container) {
      if (!this.state.isVisible) {
        setTimeout(() => {
          this.setState({
            isVisible: true
          });
        }, 1);
      }

      if (this.props.hasFocusRestriction) {
        window.addEventListener("focus", this.onFocus, true);
      }

      window.addEventListener("keydown", this.onKeyDown);

      lockScroll();

      if (this.modalRef.current) {
        this.modalRef.current.focus();
      }
    }
  };

  private onHide = () => {
    if (this.container) {
      if (this.state.isVisible) {
        this.setState({
          isVisible: false
        });
      }

      if (this.props.hasFocusRestriction) {
        window.removeEventListener("focus", this.onFocus, true);
      }

      window.removeEventListener("keypress", this.onKeyDown);

      unlockScroll();
    }
  };
}
