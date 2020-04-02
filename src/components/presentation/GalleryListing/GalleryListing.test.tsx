import { gallery } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import GalleryListing from "./GalleryListing";

const component = new WrapperWithIntl(GalleryListing).withDefaultProps(
  gallery({
    description: "Description",
    modifiedAt: "2017-10-10T18:00:00",
    slug: "test-1",
    title: "Title",
  })
);

describe("[presentation] <GalleryListing />", () => {
  describe("when imageUrl is defined", () => {
    const onLoad = jest.fn();
    const wrapper = component
      .withProps({
        imageUrl: "Image URL",
        onLoad,
      })
      .mount();

    it("doesn't render with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(0);
    });

    it("doesn't call onLoad prop instantly", () => {
      expect(onLoad).toHaveBeenCalledTimes(0);
    });

    it("loads the image", () => {
      wrapper.find("Image").simulate("load");
    });

    it("adds isRendered class", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });

    it("calls onLoad prop", () => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when imageUrl isn't defined", () => {
    const wrapper = component.withProps({ imageUrl: undefined }).mount();

    it("renders with isRendered class instantly", () => {
      expect(wrapper.find(".isRendered")).toHaveLength(1);
    });
  });
});
