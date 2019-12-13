import { PACKAGE_FORMAT } from "../../../constants/stem.constants";
import { stem } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import StemListing from "./StemListing";

const component = new WrapperWithIntl(StemListing).withDefaultProps(
  stem({
    audioFormat: "Audio format",
    createdAt: "2017-10-10T18:00:00",
    imageUrl: "Image URL",
    packageFormat: PACKAGE_FORMAT.RAR,
    size: "Size",
    slug: "stem-1",
    title: "Title",
    url: "URL"
  })
);

describe("[presentation] <StemListing />", () => {
  const wrapper = component
    .withProps({
      onLoad: jest.fn()
    })
    .mount();

  it("doesn't add the isRendered class initially", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(0);
  });

  it("loads the image", () => {
    wrapper.find("Image.StemListing--image").simulate("load");
  });

  it("adds the isRendered class", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(1);
  });

  it("calls the onLoad prop", () => {
    expect(component.props.onLoad).toHaveBeenCalledTimes(1);
  });

  it("sets the onLoad prop to be undefined", () => {
    wrapper.setProps({ onLoad: undefined });
  });

  it("loads the image", () => {
    wrapper.find("Image.StemListing--image").simulate("load");
  });

  it("matches snapshot", () => {
    expect(wrapper.render()).toMatchSnapshot();
  });
});
