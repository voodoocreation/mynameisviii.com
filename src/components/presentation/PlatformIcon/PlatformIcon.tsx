import * as React from "react";
import {
  FaAmazon,
  FaApple,
  FaGoogle,
  FaSoundcloud,
  FaSpotify
} from "react-icons/lib/fa";
import { MdPlayCircleFilled } from "react-icons/lib/md";

interface IProps {
  value: string;
}

const PlatformIcon: React.SFC<IProps> = ({ value }) => {
  switch (value) {
    default:
      return <MdPlayCircleFilled />;

    case "amazon":
      return <FaAmazon />;

    case "apple":
    case "itunes":
      return <FaApple />;

    case "google":
      return <FaGoogle />;

    case "soundcloud":
      return <FaSoundcloud />;

    case "spotify":
      return <FaSpotify />;
  }
};

export default PlatformIcon;
