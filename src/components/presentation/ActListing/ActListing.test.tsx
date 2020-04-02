import { TYPE } from "../../../constants/location.constants";
import { performer } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import ActListing from "./ActListing";

const component = new WrapperWithIntl(ActListing).withDefaultProps(
  performer({
    genre: "Genre",
    imageUrl: "Image URL",
    location: {
      address: "City, Country",
      type: TYPE.CITY,
    },
    name: "Name",
  })
);

describe("[presentation] <ActListing />", () => {
  const wrapper = component
    .withProps({
      onLoad: jest.fn(),
    })
    .mount();

  it("doesn't add the isRendered class initially", () => {
    expect(wrapper.find(".isRendered")).toHaveLength(0);
  });

  it("loads the image", () => {
    wrapper.find("Image.ActListing--image").simulate("load");
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
    wrapper.find("Image.ActListing--image").simulate("load");
  });

  it("matches snapshot", () => {
    expect(wrapper.render()).toMatchSnapshot();
  });
});
