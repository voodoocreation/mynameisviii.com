import * as React from "react";
import { FormattedMessage } from "react-intl";

import Link from "../Link/Link";

interface IProps {
  href?: string;
  isSelected: boolean;
  messageId: string;
  onClick?: () => void;
  params?: {};
  prefetch?: boolean;
  route?: string;
}

const NavItem: React.SFC<IProps> = ({
  isSelected,
  messageId,
  onClick,
  ...linkProps
}) =>
  isSelected ? (
    <li className="isSelected" onClick={onClick}>
      <FormattedMessage id={messageId} />
    </li>
  ) : (
    <li onClick={onClick}>
      <Link {...linkProps}>
        <FormattedMessage id={messageId} />
      </Link>
    </li>
  );

NavItem.defaultProps = {
  onClick: () => undefined
};

export default NavItem;
