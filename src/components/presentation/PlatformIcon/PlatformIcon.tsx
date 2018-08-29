import * as React from "react";
import {
  FaAmazon,
  FaApple,
  FaGoogle,
  FaSoundcloud,
  FaSpotify
} from "react-icons/fa";
import { MdPlayCircleFilled } from "react-icons/md";

interface IProps {
  value: string;
}

const PlatformIcon: React.SFC<IProps> = ({ value }) => {
  switch (value) {
    default:
      return <MdPlayCircleFilled /> as React.ReactElement<any>;

    case "amazon":
      return <FaAmazon /> as React.ReactElement<any>;

    case "apple":
    case "itunes":
      return <FaApple /> as React.ReactElement<any>;

    case "google":
      return <FaGoogle /> as React.ReactElement<any>;

    case "soundcloud":
      return <FaSoundcloud /> as React.ReactElement<any>;

    case "spotify":
      return <FaSpotify /> as React.ReactElement<any>;
  }
};

export default PlatformIcon;
