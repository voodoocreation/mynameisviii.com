import cn from "classnames";
import * as React from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/lib/md";

import Modal from "../Modal/Modal";

interface IProps {
  className?: string;
  isLooped?: boolean;
  usePortal?: boolean;
  onItemClick?: (index: number) => void;
  onGoTo?: (index: number) => void;
  onModalClose?: () => void;
  onNext?: (index: number) => void;
  onPrevious?: (index: number) => void;
}

interface IState {
  currentIndex?: number;
  isOpen: boolean;
}

export default class Gallery extends React.Component<IProps, IState> {
  public static defaultProps = {
    isLooped: true,
    usePortal: true
  };

  public readonly state = {
    currentIndex: undefined,
    isOpen: false
  };

  public render() {
    const { children, className } = this.props;
    const { currentIndex } = this.state;

    const currentItem =
      currentIndex !== undefined ? this.getItemAtIndex(currentIndex) : null;

    return (
      <React.Fragment>
        <div className={cn("Gallery", className)}>
          {React.Children.map(children, (item, index) =>
            React.cloneElement(item as React.ReactElement<any>, {
              onClick: this.onItemClick(index)
            })
          )}
        </div>

        <Modal
          className="Gallery-modal"
          isOpen={this.state.isOpen}
          usePortal={this.props.usePortal}
          onClose={this.onModalClose}
          onKeyPress={this.onModalKeyPress}
        >
          <div className="Gallery-modal-item">{currentItem}</div>

          <div className="Gallery-modal-controls">
            <button className="Gallery-modal-previous" onClick={this.previous}>
              <MdArrowBack />
            </button>

            <button className="Gallery-modal-next" onClick={this.next}>
              <MdArrowForward />
            </button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }

  public goTo = (nextItemIndex: number) => {
    if (this.getItemAtIndex(nextItemIndex)) {
      this.setState({
        currentIndex: nextItemIndex
      });
    }

    if (this.props.onGoTo) {
      this.props.onGoTo(nextItemIndex);
    }
  };

  public previous = () => {
    const { currentIndex } = this.state;
    const previousIndex = currentIndex !== undefined ? currentIndex - 1 : 0;
    const goToIndex =
      this.props.isLooped && !this.getItemAtIndex(previousIndex)
        ? React.Children.count(this.props.children) - 1
        : previousIndex;

    this.goTo(goToIndex);

    if (this.props.onPrevious) {
      this.props.onPrevious(goToIndex);
    }
  };

  public next = () => {
    const { currentIndex } = this.state;
    const nextIndex = currentIndex !== undefined ? currentIndex + 1 : 0;
    const goToIndex =
      this.props.isLooped && !this.getItemAtIndex(nextIndex) ? 0 : nextIndex;

    this.goTo(goToIndex);

    if (this.props.onNext) {
      this.props.onNext(goToIndex);
    }
  };

  private getItemAtIndex = (findIndex: number) =>
    React.Children.toArray(this.props.children).find(
      (_, index) => index === findIndex
    );

  private onItemClick = (index: number) => () => {
    this.setState({
      currentIndex: index,
      isOpen: true
    });

    if (this.props.onItemClick) {
      this.props.onItemClick(index);
    }
  };

  private onModalKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        this.previous();
        break;

      case "ArrowRight":
        this.next();
        break;
    }
  };

  private onModalClose = () => {
    this.setState({
      currentIndex: undefined,
      isOpen: false
    });

    if (this.props.onModalClose) {
      this.props.onModalClose();
    }
  };
}
