import cn from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import Banner from "../../presentation/Banner/Banner";

import * as selectors from "../../../selectors/root.selectors";
import Loader from "../../presentation/Loader/Loader";

interface IStoreProps {
  isLoading: boolean;
}

interface IProps extends IStoreProps {
  className?: string;
}

class Shell extends React.Component<IProps> {
  public componentWillMount() {
    if (
      typeof document !== "undefined" &&
      !document.documentElement.classList.contains("isClientRendered")
    ) {
      document.documentElement.classList.add("isClientRendered");
    }
  }

  public render() {
    const { children, className, isLoading } = this.props;

    return (
      <article className={cn("Page", { isLoading }, className)}>
        <Banner />

        <main className="Page-body" role="main">
          {isLoading ? <Loader /> : children}
        </main>

        <div className="Portal" />
      </article>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isLoading: selectors.getPageIsLoading(state)
});

export default connect<IStoreProps>(mapStateToProps)(Shell);
