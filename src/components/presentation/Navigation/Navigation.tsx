import cn from "classnames";
import { withRouter, WithRouterProps } from "next/router";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import NavItem from "./NavItem";

interface IProps extends WithRouterProps {}

interface IState {
  currentRoute?: string;
  isOpen: boolean;
}

class Navigation extends React.Component<IProps, IState> {
  public readonly state = {
    currentRoute: undefined,
    isOpen: false
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
        className={cn("Navigation", { isOpen: this.state.isOpen })}
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
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  private onNavItemClick = () => {
    this.setState({
      isOpen: false
    });
  };

  private renderNavItem = (route: string, messageId: string) => (
    <NavItem
      route={route}
      messageId={messageId}
      isSelected={this.state.currentRoute === route}
      onClick={this.onNavItemClick}
    />
  );
}

export default withRouter<any>(Navigation);
