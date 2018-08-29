import cn from "classnames";
import * as React from "react";
import {
  FaCreativeCommons,
  FaCreativeCommonsBy,
  FaCreativeCommonsNc,
  FaCreativeCommonsSa
} from "react-icons/fa";
import { MdCloudDownload } from "react-icons/md";
import { InjectedIntl, injectIntl } from "react-intl";

import Image from "../Image/Image";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";

interface IProps extends IStem {
  intl: InjectedIntl;
  onLoad: (slug: string) => void;
}

interface IState {
  isRendered: boolean;
}

class StemListing extends React.Component<IProps, IState> {
  public readonly state = {
    isRendered: false
  };

  public render() {
    const { intl, onLoad, ...stem } = this.props;
    const { formatMessage } = intl;
    const { isRendered } = this.state;

    return (
      <article className={cn("StemListing", { isRendered })}>
        <Link href={stem.url} isExternal={true} className="StemListing-link">
          <div className="StemListing-details">
            <header className="StemListing-header">
              <h2>
                <span>{stem.title}</span>
              </h2>
            </header>

            <section className="StemListing-meta">
              <Meta
                className="StemListing-audioFormat"
                labelConstant="AUDIO_FORMAT"
              >
                {stem.audioFormat}
              </Meta>

              <Meta
                className="StemListing-packageFormat"
                labelConstant="PACKAGE_FORMAT"
              >
                {stem.packageFormat}, {stem.size}
              </Meta>

              <Meta
                className="StemListing-licence"
                icon={
                  <React.Fragment>
                    <FaCreativeCommons />
                    <FaCreativeCommonsBy />
                    <FaCreativeCommonsNc />
                    <FaCreativeCommonsSa />
                  </React.Fragment>
                }
                labelConstant="LICENCED_UNDER_CC_REMIX"
                title={formatMessage({ id: "LICENCED_UNDER_CC_REMIX" })}
              />
            </section>
          </div>

          <div className="StemListing-thumbnail">
            <Image
              alt={stem.title}
              className="StemListing-image"
              onLoad={this.onLoad}
              src={stem.imageUrl}
            />

            <div className="StemListing-downloadIcon">
              <MdCloudDownload />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad(this.props.slug);
    }
  };
}

export default injectIntl<any>(StemListing);
