import cn from "classnames";
import * as React from "react";
import { MdAccessTime, MdDateRange, MdPeople, MdPlace } from "react-icons/lib/md";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import Schema from "../../schema/Appearance";
import DateTime from "../DateTime/DateTime";
import Link from "../Link/Link";
import Meta from "../Meta/Meta";
import PriceRange from "../Price/PriceRange";

import * as selectors from "../../../selectors/root.selectors";

interface IState {
  isRendered: boolean;
}

interface IProps extends IAppearance {
  intl: InjectedIntl;
  onLoad?: (slug: string) => void;
}

class AppearanceListing extends React.Component<IProps, IState> {
  public state = {
    isRendered: false
  };

  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onLoad, 1);
    }
  }

  public render() {
    const { intl, onLoad, ...appearance } = this.props;
    const { isRendered } = this.state;

    const isCancelled = appearance.status === "EventCancelled";
    const isPostponed = appearance.status === "EventPostponed";
    const isFinished = appearance.finishingAt < new Date().toISOString();

    const priceRange: IPriceRange = selectors.getAppearancePriceRange(
      appearance
    );

    return (
      <article
        className={cn(
          "AppearanceListing",
          { isRendered },
          { isCancelled },
          { isPostponed },
          { isFinished }
        )}
      >
        <Link route={`/appearances/${appearance.slug}`}>
          <div className="AppearanceListing-details">
            <header className="AppearanceListing-header">
              <h3>{appearance.title}</h3>
            </header>

            <section className="AppearanceListing-meta">
              {isCancelled ? (
                <Meta
                  className="AppearanceListing-status"
                  labelConstant="STATUS"
                >
                  <FormattedMessage id="CANCELLED" />
                </Meta>
              ) : null}
              {isPostponed ? (
                <Meta
                  className="AppearanceListing-status"
                  labelConstant="POSTPONED"
                >
                  <FormattedMessage id="POSTPONED" />
                </Meta>
              ) : null}
              <Meta
                className="AppearanceListing-date"
                icon={<MdDateRange />}
                labelConstant="DATE"
              >
                <DateTime
                  isDateOnly={true}
                  isRelative={false}
                  options={{
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }}
                  value={appearance.startingAt}
                />
              </Meta>

              <Meta
                className="AppearanceListing-time"
                icon={<MdAccessTime />}
                labelConstant="TIME"
              >
                <DateTime
                  isRelative={false}
                  options={{
                    hour: "numeric",
                    hour12: true,
                    minute: "numeric"
                  }}
                  value={appearance.startingAt}
                />
              </Meta>

              <Meta
                className="AppearanceListing-location"
                icon={<MdPlace />}
                labelConstant="LOCATION"
                title={`${appearance.location.name} - ${
                  appearance.location.address
                }`}
              >
                {appearance.location.name}
              </Meta>

              {appearance.audience ? (
                <Meta
                  className="AppearanceListing-audience"
                  icon={<MdPeople />}
                  labelConstant="AUDIENCE"
                >
                  {appearance.audience}
                </Meta>
              ) : null}

              <Meta className="AppearanceListing-price" labelConstant="PRICE">
                <PriceRange max={priceRange.max} min={priceRange.min} />
              </Meta>
            </section>
          </div>

          <figure className="AppearanceListing-image">
            <img
              alt={appearance.title}
              onLoad={this.onLoad}
              onError={this.onLoad}
              ref={this.imageRef}
              src={appearance.imageUrl}
            />
          </figure>
        </Link>

        <Schema {...appearance} />
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

export default injectIntl<any>(AppearanceListing);
