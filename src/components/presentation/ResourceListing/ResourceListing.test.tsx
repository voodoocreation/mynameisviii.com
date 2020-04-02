import { resource } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import ResourceListing from "./ResourceListing";

const component = new WrapperWithIntl(ResourceListing).withDefaultProps(
  resource({
    createdAt: "2017-10-10T18:00:00",
    description: "Description",
    imageUrl: "Image URL",
    slug: "resource-1",
    title: "Title",
    url: "URL",
  })
);

describe("[presentation] <ResourceListing />", () => {
  const wrapper = component
    .withProps({
      onLoad: jest.fn(),
    })
    .mount();

  it("doesn't add the isRendered class initially", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(0);
  });

  it("loads the image", () => {
    wrapper.find("Image.ResourceListing--image").simulate("load");
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
    wrapper.find("Image.ResourceListing--image").simulate("load");
  });

  it("matches snapshot", () => {
    expect(wrapper.render()).toMatchSnapshot();
  });
});
