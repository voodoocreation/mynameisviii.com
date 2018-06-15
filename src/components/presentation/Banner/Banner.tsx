import * as React from "react";

import Brand from "../Brand/Brand";
import Navigation from "../Navigation/Navigation";

const Banner: React.SFC<{}> = () => (
  <header className="Banner" role="banner">
    <Brand />
    <Navigation />
  </header>
);

export default Banner;
