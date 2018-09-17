import cn from "classnames";
import * as React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import NavItem from "../../presentation/NavItem/NavItem";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  isOpen: boolean;
  currentRoute?: string;
}

interface IDispatchProps {
  setCurrentRoute: ActionCreator<PLSetCurrentRoute>;
  toggleNavigation: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class Navigation extends React.Component<IProps> {
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
          {this.renderNavItem("/galleries", "GALLERIES_TITLE")}
          {this.renderNavItem("/stems", "STEMS_TITLE")}
          {this.renderNavItem("/appearances", "APPEARANCES_TITLE")}
        </ul>
      </nav>
    );
  }

  private onMenuButtonClick = () => {
    this.props.toggleNavigation({});
  };

  private renderNavItem = (route: string, messageId: string) => (
    <NavItem route={route} isSelected={this.props.currentRoute === route}>
      <FormattedMessage id={messageId} />
    </NavItem>
  );
}

const mapStateToProps = (state: any) => ({
  currentRoute: selectors.getCurrentRoute(state),
  isOpen: selectors.isNavOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setCurrentRoute: actions.setCurrentRoute,
      toggleNavigation: actions.toggleNavigation
    },
    dispatch
  );

export default injectIntl<any>(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
