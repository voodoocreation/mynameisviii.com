import cn from "classnames";
import * as React from "react";
import { MdClose } from "react-icons/md";
import { injectIntl, WrappedComponentProps } from "react-intl";

import Button from "../Button/Button";

import "./Toast.scss";

interface IProps extends WrappedComponentProps {
  autoDismissDelay?: number;
  children: React.ReactNode;
  className?: string;
  hasAutoDismiss?: boolean;
  isVisible?: boolean;
  onClose?: () => void;
}

interface IState {
  isRendered: boolean;
  isToggled: boolean;
  isVisible: boolean;
}

class Toast extends React.Component<IProps, IState> {
  public static defaultProps = {
    autoDismissDelay: 5000,
    hasAutoDismiss: true,
    isVisible: true
  };

  private dismissTimeOut: any = undefined;
  private visibilityTimeout: any = undefined;

  constructor(props: IProps) {
    super(props);

    this.state = {
      isRendered: !!props.isVisible,
      isToggled: !!props.isVisible,
      isVisible: false
    };
  }

  public componentDidMount() {
    this.toggleVisibility(!!this.props.isVisible);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.isVisible !== this.props.isVisible &&
      this.props.isVisible !== this.state.isToggled
    ) {
      this.toggleVisibility(!!this.props.isVisible);
    }
  }

  public render() {
    const { children, className } = this.props;
    const { formatMessage } = this.props.intl;
    const { isRendered, isVisible } = this.state;

    return !isRendered ? null : (
      <div className={cn("Toast", className, { isHidden: !isVisible })}>
        <div className="Toast--content">
          <div className="Toast--message">{children}</div>

          <Button
            className="Toast--closeButton"
            isStyled={false}
            title={formatMessage({ id: "CLOSE" })}
            onClick={this.onClose}
          >
            <MdClose />
          </Button>
        </div>
      </div>
    );
  }

  private toggleVisibility = (isVisible: boolean) => {
    this.setState({
      isToggled: isVisible,
      [isVisible ? "isRendered" : "isVisible"]: isVisible
    } as any);

    clearTimeout(this.visibilityTimeout);

    this.visibilityTimeout = setTimeout(() => {
      this.setState({
        [isVisible ? "isVisible" : "isRendered"]: isVisible
      } as any);

      if (isVisible && this.props.hasAutoDismiss) {
        clearTimeout(this.dismissTimeOut);

        this.dismissTimeOut = setTimeout(
          this.onClose,
          this.props.autoDismissDelay
        );
      }
    }, 200);
  };

  private onClose = () => {
    this.toggleVisibility(false);

    if (this.props.onClose) {
      this.props.onClose();
    }
  };
}

export default injectIntl(Toast);
