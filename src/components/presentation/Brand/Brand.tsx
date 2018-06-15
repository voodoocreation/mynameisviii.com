import * as React from "react";
import { FormattedMessage } from "react-intl";

import Link from "../Link/Link";

import logoName from "../../../../static/img/logo-name.svg";
import logoSymbol from "../../../../static/img/logo-symbol.svg";

const Brand: React.SFC<{}> = () => (
  <Link className="Brand" href="/">
    <FormattedMessage id="BRAND_NAME" />
    <svg
      {...logoName.attributes}
      dangerouslySetInnerHTML={{ __html: logoName.content }}
    />
    <svg
      {...logoSymbol.attributes}
      dangerouslySetInnerHTML={{ __html: logoSymbol.content }}
    />
  </Link>
);

export default Brand;
