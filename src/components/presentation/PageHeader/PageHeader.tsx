import * as React from "react";

const PageHeader: React.SFC<{}> = ({ children }) =>
  (
    <header className="PageHeader">
      <h1>{children}</h1>
    </header>
  ) as React.ReactElement<any>;

export default PageHeader;
