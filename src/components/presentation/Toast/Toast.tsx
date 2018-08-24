import cn from "classnames";
import * as React from "react";
import { MdClose } from "react-icons/lib/md";
import { InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  autoDismissDelay: number;
  className?: string;
  hasAutoDismiss: boolean;
  intl: InjectedIntl;
  isVisible?: boolean;
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

  private dismissTimeOut: number | undefined = undefined;
  private visibilityTimeout: number | undefined = undefined;

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

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.isVisible !== this.state.isToggled) {
      this.toggleVisibility(!!nextProps.isVisible);
    }
  }

  public render() {
    const { children, className } = this.props;
    const { formatMessage } = this.props.intl;
    const { isRendered, isVisible } = this.state;

    return !isRendered ? null : (
      <div className={cn("Toast", className, { isHidden: !isVisible })}>
        <div className="Toast-content">
          <div className="Toast-message">{children}</div>

          <button
            className="Toast-closeButton"
            onClick={this.onClose}
            title={formatMessage({ id: "CLOSE" })}
          >
            <MdClose />
          </button>
        </div>
      </div>
    );
  }

  private toggleVisibility = (isVisible: boolean) => {
    this.setState({
      isToggled: isVisible,
      [isVisible ? "isRendered" : "isVisible"]: isVisible
    } as any);

    if (this.visibilityTimeout) {
      window.clearTimeout(this.visibilityTimeout);
    }

    this.visibilityTimeout = window.setTimeout(() => {
      this.setState({
        [isVisible ? "isVisible" : "isRendered"]: isVisible
      } as any);

      if (isVisible && this.props.hasAutoDismiss) {
        if (this.dismissTimeOut) {
          window.clearTimeout(this.dismissTimeOut);
        }

        this.dismissTimeOut = window.setTimeout(
          this.toggleVisibility.bind(this, false),
          this.props.autoDismissDelay
        );
      }
    }, 200);
  };

  private onClose = () => {
    this.toggleVisibility(false);
  };
}

export default injectIntl<any>(Toast);
