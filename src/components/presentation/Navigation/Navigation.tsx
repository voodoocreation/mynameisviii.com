import cn from "classnames";
import { withRouter, WithRouterProps } from "next/router";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import NavItem from "./NavItem";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  isOpen: boolean;
}

interface IDispatchProps {
  toggleNavigation: ActionCreator<{}>;
}

interface IProps extends WithRouterProps, IStoreProps, IDispatchProps {}

interface IState {
  currentRoute?: string;
}

class Navigation extends React.Component<IProps, IState> {
  public readonly state = {
    currentRoute: undefined
  };

  private currentRouteTimeout: undefined | NodeJS.Timer = undefined;

  public componentDidMount() {
    this.currentRouteTimeout = setTimeout(() => {
      this.setState({
        currentRoute: this.props.router.route
      });
    }, 1);
  }

  public componentWillUpdate(nextProps: IProps) {
    if (this.currentRouteTimeout) {
      clearTimeout(this.currentRouteTimeout);
    }

    this.currentRouteTimeout = setTimeout(() => {
      this.setState({
        currentRoute: nextProps.router.route
      });
    }, 1);
  }

  public componentWillUnmount() {
    if (this.currentRouteTimeout) {
      clearTimeout(this.currentRouteTimeout);
    }
  }

  public render() {
    return (
      <nav
        className={cn("Navigation", { isOpen: this.props.isOpen })}
        role="navigation"
      >
        <button onClick={this.onMenuButtonClick}>
          <FormattedMessage id="MENU" />
        </button>
        <ul>
          {this.renderNavItem("/news", "NEWS_TITLE")}
          {this.renderNavItem("/releases", "RELEASES_TITLE")}
          {this.renderNavItem("/appearances", "APPEARANCES_TITLE")}
        </ul>
      </nav>
    );
  }

  private onMenuButtonClick = () => {
    this.props.toggleNavigation({});
  };

  private renderNavItem = (route: string, messageId: string) => (
    <NavItem
      route={route}
      messageId={messageId}
      isSelected={this.state.currentRoute === route}
    />
  );
}

const mapStateToProps = (state: any) => ({
  isOpen: selectors.isNavOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      toggleNavigation: actions.toggleNavigation
    },
    dispatch
  );

export default connect<IStoreProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter<any>(Navigation));
