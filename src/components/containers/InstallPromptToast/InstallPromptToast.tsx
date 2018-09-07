import moment from "moment";
import * as React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import Button from "../../presentation/Button/Button";
import Toast from "../../presentation/Toast/Toast";

import * as actions from "../../../actions/root.actions";
import {
  getLocalStorage,
  setLocalStorage
} from "../../../services/configureLocalStorage";

interface IDispatchProps {
  trackEvent: ActionCreator<PLTrackEvent>;
}

interface IProps extends IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  isVisible: boolean;
}

class InstallPromptToast extends React.Component<IProps, IState> {
  public readonly state = {
    isVisible: false
  };

  private deferredEvent: any = undefined;

  public componentDidMount() {
    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
  }

  public componentWillUnmount() {
    window.removeEventListener(
      "beforeinstallprompt",
      this.onBeforeInstallPrompt
    );
  }

  public render() {
    return this.state.isVisible ? (
      <Toast hasAutoDismiss={false} onClose={this.onClose}>
        <FormattedMessage id="ADD_TO_HOME_SCREEN" />
        <Button className="Toast-installButton" onClick={this.onInstallClick}>
          <FormattedMessage id="INSTALL" />
        </Button>
      </Toast>
    ) : null;
  }

  private onClose = async () => {
    this.props.trackEvent({
      event: "addToHomeScreen",
      outcome: "toast closed"
    });

    setLocalStorage("addToHomeScreen.dismissed", `${Date.now()}`);
  };

  private onBeforeInstallPrompt = (event: any) => {
    event.preventDefault();
    this.deferredEvent = event;

    const { data } = getLocalStorage("addToHomeScreen.dismissed");
    const dismissedAt = moment.unix(Number(data));
    const expiredAt = moment(new Date()).subtract(3, "days");

    if (!data || expiredAt.isSameOrAfter(dismissedAt)) {
      this.setState({
        isVisible: true
      });
    }
  };

  private onInstallClick = async () => {
    this.setState({
      isVisible: false
    });

    this.deferredEvent.prompt();
    const { outcome } = await this.deferredEvent.userChoice;

    this.props.trackEvent({
      event: "addToHomeScreen",
      outcome
    });

    if (outcome === "dismissed") {
      setLocalStorage("addToHomeScreen.dismissed", `${Date.now()}`);
    }

    this.deferredEvent = undefined;
  };
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntl<any>(
  connect<undefined, IDispatchProps>(
    undefined,
    mapDispatchToProps
  )(InstallPromptToast)
);
