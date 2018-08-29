import cn from "classnames";
import * as React from "react";
import { MdAlbum, MdEvent, MdNewReleases } from "react-icons/md";
import { InjectedIntl, injectIntl } from "react-intl";

interface IProps {
  className?: string;
  hasLabel?: boolean;
  intl: InjectedIntl;
  value: string;
}

const Type: React.SFC<IProps> = ({
  className,
  hasLabel,
  intl,
  value,
  ...props
}) => {
  let icon;
  let label;

  switch (value) {
    case "release":
      icon = <MdAlbum />;
      label = intl.formatMessage({ id: "RELEASE" });
      break;

    case "appearance":
      icon = <MdEvent />;
      label = intl.formatMessage({ id: "APPEARANCE" });
      break;

    default:
      icon = <MdNewReleases />;
      label = intl.formatMessage({ id: "NEWS" });
      break;
  }

  return (
    <div
      className={cn("Type", `Type-${value}`, className)}
      title={!hasLabel ? label : undefined}
      {...props}
    >
      {icon}
      {hasLabel ? ` ${label}` : null}
    </div>
  ) as React.ReactElement<any>;
};

Type.defaultProps = {
  hasLabel: true
};

export default injectIntl<any>(Type);
