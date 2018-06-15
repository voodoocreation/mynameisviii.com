import * as React from "react";
import { FaTicket } from "react-icons/lib/fa";
import { MdLanguage } from "react-icons/lib/md";

import { extractDomain } from "../../../domain/transformData";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import Price from "../Price/Price";

const SaleListing: React.SFC<IOffer> = ({ ...sale }) => (
  <article className="SaleListing">
    <Link href={sale.url} isExternal={true} className="SaleListing-link">
      <div className="SaleListing-icon">
        <FaTicket />
      </div>

      <div className="SaleListing-details">
        <h3>
          {sale.name}:{" "}
          <Price currency={sale.priceCurrency} value={sale.price} />
        </h3>

        <section className="SaleListing-meta">
          {sale.url ? (
            <Meta
              className="SaleListing-website"
              icon={<MdLanguage />}
              labelConstant="WEBSITE"
            >
              {extractDomain(sale.url)}
            </Meta>
          ) : null}
        </section>
      </div>
    </Link>
  </article>
);

export default SaleListing;
