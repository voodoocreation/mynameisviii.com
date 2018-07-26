import * as React from "react";

import Link from "../Link/Link";

interface IProps {
  href?: string;
  isSelected?: boolean;
  onClick?: () => void;
  params?: {};
  prefetch?: boolean;
  route?: string;
}

const NavItem: React.SFC<IProps> = ({
  children,
  isSelected,
  onClick,
  ...linkProps
}) =>
  isSelected ? (
    <li className="isSelected" onClick={onClick}>
      {children}
    </li>
  ) : (
    <li onClick={onClick}>
      <Link {...linkProps}>{children}</Link>
    </li>
  );

NavItem.defaultProps = {
  isSelected: false,
  onClick: () => undefined
};

export default NavItem;
