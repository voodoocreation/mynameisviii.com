import * as React from "react";

import Navigation from "../../containers/Navigation/Navigation";
import Brand from "../Brand/Brand";

const Banner: React.SFC<{}> = () => (
  <header className="Banner" role="banner">
    <Brand />
    <Navigation />
  </header>
);

export default Banner;
