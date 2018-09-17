import * as React from "react";

import Navigation from "../../connected/Navigation/Navigation";
import Brand from "../Brand/Brand";

const Banner: React.SFC<{}> = () =>
  (
    <header className="Banner" role="banner">
      <Brand />
      <Navigation />
    </header>
  ) as React.ReactElement<any>;

export default Banner;
