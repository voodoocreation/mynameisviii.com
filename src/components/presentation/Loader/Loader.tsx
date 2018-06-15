import * as React from "react";

const Loader: React.SFC<{}> = () => (
  <span className="Loader">
    <div className="Loader-animation">
      <span />
      <span />
      <span />
    </div>
  </span>
);

export default Loader;
