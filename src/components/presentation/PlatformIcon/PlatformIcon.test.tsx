import { Wrapper } from "react-test-wrapper";

import { PLATFORM } from "../../../constants/release.constants";
import PlatformIcon from "./PlatformIcon";

const component = new Wrapper(PlatformIcon);

describe("[presentation] <PlatformIcon />", () => {
  it("renders the correct default icon", () => {
    const wrapper = component.mount();

    expect(wrapper.find("MdPlayCircleFilled")).toHaveLength(1);
  });

  it("renders the correct icon for AMAZON", () => {
    const wrapper = component.withProps({ value: PLATFORM.AMAZON }).mount();

    expect(wrapper.find("FaAmazon")).toHaveLength(1);
  });

  it("renders the correct icon for APPLE", () => {
    const wrapper = component.withProps({ value: PLATFORM.APPLE }).mount();

    expect(wrapper.find("FaApple")).toHaveLength(1);
  });

  it("renders the correct icon for ITUNES", () => {
    const wrapper = component.withProps({ value: PLATFORM.ITUNES }).mount();

    expect(wrapper.find("FaApple")).toHaveLength(1);
  });

  it("renders the correct icon for GOOGLE", () => {
    const wrapper = component.withProps({ value: PLATFORM.GOOGLE }).mount();

    expect(wrapper.find("FaGoogle")).toHaveLength(1);
  });

  it("renders the correct icon for SOUNDCLOUD", () => {
    const wrapper = component.withProps({ value: PLATFORM.SOUNDCLOUD }).mount();

    expect(wrapper.find("FaSoundcloud")).toHaveLength(1);
  });

  it("renders the correct icon for SPOTIFY", () => {
    const wrapper = component.withProps({ value: PLATFORM.SPOTIFY }).mount();

    expect(wrapper.find("FaSpotify")).toHaveLength(1);
  });
});
