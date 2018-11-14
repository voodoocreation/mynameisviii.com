import cn from "classnames";
import { Map } from "google-maps-react";
import * as React from "react";

import styles from "./styles.json";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  disableDefaultUI?: boolean;
  initialCenter: ILatLng;
  zoom?: number;
  zoomControl?: boolean;
}

const ConnectedMap: React.SFC<IProps> = ({ children, className, ...props }) =>
  (
    <div className="Map">
      <Map
        google={window.google}
        className={cn("Map-element", className)}
        styles={styles}
        {...props}
      >
        {children}
      </Map>
    </div>
  ) as React.ReactElement<any>;

ConnectedMap.defaultProps = {
  disableDefaultUI: true,
  zoom: 14,
  zoomControl: true
};

export default ConnectedMap;
