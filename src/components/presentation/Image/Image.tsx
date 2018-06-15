import cn from "classnames";
import * as React from "react";

interface IProps {
  alt: string;
  caption?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  src: string;
  title?: string;
}

interface IState {
  isRendered: boolean;
}

export default class Image extends React.Component<IProps, IState> {
  public readonly state = {
    isRendered: false
  };

  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  public componentDidMount() {
    if (this.imageRef.current && this.imageRef.current.complete) {
      setTimeout(this.onLoad, 1);
    }
  }

  public render() {
    const {
      alt,
      caption,
      className,
      onClick,
      src,
      title,
      ...props
    } = this.props;
    const { isRendered } = this.state;

    const clickableProps = onClick
      ? {
          onClick,
          onKeyPress: this.onKeyPress,
          role: "button",
          tabIndex: 0
        }
      : undefined;

    return (
      <figure
        className={cn("Image", className, { isRendered })}
        {...clickableProps}
        {...props}
      >
        <div className="Image-wrapper">
          <img
            src={src}
            alt={alt}
            onLoad={this.onLoad}
            onError={this.onLoad}
            ref={this.imageRef}
            title={title}
          />
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  private onKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && this.props.onClick) {
      this.props.onClick();
    }
  };

  private onLoad = () => {
    this.setState({
      isRendered: true
    });

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };
}
