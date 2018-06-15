import NextLink from "next/link";
import { SingletonRouter, withRouter } from "next/router";
import * as React from "react";

import Routes from "../../../../next.routes";

interface IProps extends SingletonRouter {
  children: React.ReactNode | React.ReactNode[];
  href?: string;
  isExternal?: boolean;
  params?: {};
  prefetch?: boolean;
  route?: string;
  [index: string]: any;
}

interface IState {
  isErrorPage: boolean;
}

class Link extends React.Component<IProps, IState> {
  public static defaultProps = {
    isExternal: false,
    prefetch: false
  };

  public readonly state = {
    isErrorPage: false
  };

  public componentDidMount() {
    if (
      this.props.router &&
      Object.keys(this.props.router.components).length < 1
    ) {
      this.setState({ isErrorPage: true });
    }
  }

  public render() {
    const {
      children,
      href,
      isExternal,
      params,
      prefetch,
      route,
      router,
      ...props
    } = this.props;

    const externalProps: { target?: string; rel?: string } = {};

    if (isExternal) {
      externalProps.target = "_blank";
      externalProps.rel = "noopener";
    }

    if (!href && !route) {
      return <span {...props}>{children}</span>;
    }

    if (this.state.isErrorPage || !router) {
      return (
        <a href={route ? route : href} {...externalProps} {...props}>
          {children}
        </a>
      );
    }

    if (route) {
      return (
        <Routes.Link route={route} params={params} prefetch={prefetch}>
          <a {...externalProps} {...props}>
            {children}
          </a>
        </Routes.Link>
      );
    }

    return (
      <NextLink href={href} prefetch={prefetch}>
        <a {...externalProps} {...props}>
          {children}
        </a>
      </NextLink>
    );
  }
}

export default withRouter<any>(Link);
