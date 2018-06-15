import cn from "classnames";
import * as React from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/lib/md";

import Modal from "../Modal/Modal";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  isLooped?: boolean;
  onItemClick?: (index: number) => void;
  onGoTo?: (index: number) => void;
  onModalClose?: () => void;
  onNext?: (index: number) => void;
  onPrevious?: (index: number) => void;
}

interface IState {
  currentItemIndex?: number;
  isOpen: boolean;
}

export default class Gallery extends React.Component<IProps, IState> {
  public static defaultProps = {
    isLooped: true
  };

  public readonly state = {
    currentItemIndex: undefined,
    isOpen: false
  };

  public render() {
    const { children, className } = this.props;
    const { currentItemIndex } = this.state;

    const currentItem =
      currentItemIndex !== undefined
        ? this.getItemAtIndex(currentItemIndex)
        : null;

    return React.Children.count(children) > 0 ? (
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
          onClose={this.onModalClose}
          onKeyDown={this.onModalKeyDown}
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
    ) : null;
  }

  public goTo = (nextItemIndex: number) => {
    if (this.getItemAtIndex(nextItemIndex)) {
      this.setState({
        currentItemIndex: nextItemIndex
      });
    }

    if (this.props.onGoTo) {
      this.props.onGoTo(nextItemIndex);
    }
  };

  public previous = () => {
    const { currentItemIndex } = this.state;
    const previousIndex =
      currentItemIndex !== undefined ? currentItemIndex - 1 : 0;
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
    const { currentItemIndex } = this.state;
    const nextIndex = currentItemIndex !== undefined ? currentItemIndex + 1 : 0;
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
      currentItemIndex: index,
      isOpen: true
    });

    if (this.props.onItemClick) {
      this.props.onItemClick(index);
    }
  };

  private onModalKeyDown = (event: KeyboardEvent) => {
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
      currentItemIndex: undefined,
      isOpen: false
    });

    if (this.props.onModalClose) {
      this.props.onModalClose();
    }
  };
}
