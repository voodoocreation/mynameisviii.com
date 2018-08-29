import cn from "classnames";
import merge from "lodash.merge";
import * as React from "react";
import { GoogleMap, GoogleMapProps, withGoogleMap } from "react-google-maps";

import styles from "./styles.json";

interface IProps extends GoogleMapProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

const Map = withGoogleMap(
  ({ children, ...props }: IProps) =>
    <GoogleMap {...props}>{children}</GoogleMap> as React.ReactElement<any>
);

const ConnectedMap: React.SFC<IProps> = ({
  children,
  className,
  defaultOptions,
  ...props
}) =>
  (
    <Map
      {...props}
      containerElement={
        (
          <div className={cn("Map-container", className)} />
        ) as React.ReactElement<any>
      }
      defaultOptions={merge({ styles }, defaultOptions)}
      mapElement={<div className="Map" /> as React.ReactElement<any>}
    >
      {children}
    </Map>
  ) as React.ReactElement<any>;

ConnectedMap.defaultProps = {
  defaultZoom: 17
};

export default ConnectedMap;
