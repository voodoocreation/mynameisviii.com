import cn from "classnames";
import * as React from "react";
import { MdClose } from "react-icons/lib/md";

import { isInPortal, lockScroll, unlockScroll } from "../../../helpers/dom";
import Portal from "../Portal/Portal";

interface IProps {
  className?: string;
  hasFocusRestriction?: boolean;
  hasOverlayClick?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  usePortal?: boolean;
}

interface IState {
  isVisible: boolean;
}

export default class Modal extends React.Component<IProps, IState> {
  public static defaultProps = {
    hasFocusRestriction: true,
    hasOverlayClick: true,
    usePortal: true
  };

  public readonly state = {
    isVisible: false
  };

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidMount() {
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
    const {
      children,
      className,
      hasOverlayClick,
      isOpen,
      usePortal
    } = this.props;
    const { isVisible } = this.state;

    return !isOpen ? null : (
      <Portal className="ModalPortal" isRenderingInPlace={!usePortal}>
        <div
          aria-hidden={!isOpen}
          aria-modal={true}
          className={cn("Modal", className, { isVisible })}
          ref={this.modalRef}
          role="dialog"
          tabIndex={isVisible ? 0 : -1}
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
      </Portal>
    );
  }

  private onFocus = (event: FocusEvent) => {
    const { hasFocusRestriction, isOpen, usePortal } = this.props;
    const modalRef = this.modalRef.current as HTMLDivElement;

    if (
      modalRef &&
      event.target &&
      isOpen &&
      hasFocusRestriction &&
      (event.target === window ||
        (usePortal && !isInPortal(event.target as HTMLElement)) ||
        (!usePortal && modalRef.contains(event.target as Node)))
    ) {
      event.stopPropagation();
      modalRef.focus();
    }
  };

  private onClose = () => {
    this.props.onClose();
  };

  private onKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.onClose();
    }

    if (this.props.onKeyPress) {
      this.props.onKeyPress(event);
    }
  };

  private onShow = () => {
    const modalRef = this.modalRef.current as HTMLDivElement;
    window.addEventListener("keypress", this.onKeyPress);

    if (this.props.hasFocusRestriction) {
      window.addEventListener("focus", this.onFocus, true);
    }

    this.setState({
      isVisible: true
    });
    lockScroll();
    modalRef.focus();
  };

  private onHide = () => {
    window.removeEventListener("keypress", this.onKeyPress);

    if (this.props.hasFocusRestriction) {
      window.removeEventListener("focus", this.onFocus, true);
    }

    unlockScroll();
    this.setState({
      isVisible: false
    });
  };
}
