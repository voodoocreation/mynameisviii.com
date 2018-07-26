import cn from "classnames";
import * as React from "react";

interface IProps {
  className?: string;
  currentIndex?: number;
  onSlideChange?: (index: number) => void;
}

interface IState {
  currentIndex: number;
}

class Carousel extends React.Component<IProps, IState> {
  public static defaultProps = {
    currentIndex: 0
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      currentIndex: props.currentIndex || 0
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (
      nextProps.currentIndex !== undefined &&
      nextProps.currentIndex !== this.state.currentIndex
    ) {
      this.setState({
        currentIndex: nextProps.currentIndex
      });
    }
  }

  public render() {
    const { children, className } = this.props;

    return (
      <div className={cn("Carousel", className)}>
        <div
          className="Carousel-slides"
          style={{
            transform: `translate3d(-${this.state.currentIndex * 100}%, 0, 0)`
          }}
        >
          {children}
        </div>
        {this.renderPagination()}
      </div>
    );
  }

  private onPaginationClick = (index: number) => () => {
    this.setState({
      currentIndex: index
    });

    if (this.props.onSlideChange) {
      this.props.onSlideChange(index);
    }
  };

  private renderPagination() {
    const { children } = this.props;

    if (!children || React.Children.count(children) < 2) {
      return null;
    }

    return (
      <div className="Carousel-pagination">
        {React.Children.map(children, (_, index) => (
          <button
            className={cn("Carousel-page", {
              isSelected: index === this.state.currentIndex
            })}
            onClick={this.onPaginationClick(index)}
          >
            <span>{index + 1}</span>
          </button>
        ))}
      </div>
    );
  }
}

export default Carousel;
