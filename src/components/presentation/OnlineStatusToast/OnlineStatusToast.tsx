import * as React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Toast from "../Toast/Toast";

interface IProps {
  intl: InjectedIntl;
  isOnline: boolean;
}

interface IState {
  isVisible: boolean;
}

class OnlineStatusToast extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isVisible: !props.isOnline
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.isOnline !== prevProps.isOnline) {
      this.setState({
        isVisible: true
      });
    }
  }

  public render() {
    const { isOnline } = this.props;
    const { isVisible } = this.state;

    return (
      <Toast className="OnlineStatusToast" isVisible={isVisible}>
        {isOnline ? (
          <FormattedMessage id="YOU_ARE_BACK_ONLINE" />
        ) : (
          <FormattedMessage id="YOU_ARE_OFFLINE" />
        )}
      </Toast>
    );
  }
}

export default injectIntl<any>(OnlineStatusToast);
