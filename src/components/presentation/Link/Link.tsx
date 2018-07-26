import NextLink from "next/link";
import { withRouter, WithRouterProps } from "next/router";
import * as React from "react";

import Routes from "../../../../next.routes";

interface IProps extends WithRouterProps {
  href?: string;
  isExternal?: boolean;
  params?: {};
  prefetch?: boolean;
  [index: string]: any;
}

class Link extends React.Component<IProps> {
  public static defaultProps = {
    isExternal: false,
    prefetch: false
  };

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

    if (
      !router ||
      !router.components ||
      Object.keys(router.components).length < 1
    ) {
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
