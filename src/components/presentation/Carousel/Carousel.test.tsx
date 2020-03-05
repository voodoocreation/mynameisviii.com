import * as React from "react";

import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import Carousel from "./Carousel";

const component = new WrapperWithIntl(Carousel).withDefaultProps({
  onSlideChange: jest.fn()
});

describe("[presentation] <Carousel />", () => {
  describe("when there are several children", () => {
    const wrapper = component
      .withChildren([
        <div className="Slide" key="slide-1" />,
        <div className="Slide" key="slide-2" />,
        <div className="Slide" key="slide-3" />
      ])
      .mount();

    it("renders all of the children", () => {
      expect(wrapper.find(".Slide")).toHaveLength(3);
    });

    it("renders the pagination correctly", () => {
      expect(wrapper.find(".Carousel--pagination")).toHaveLength(1);
      expect(wrapper.find(".Carousel--pagination Button")).toHaveLength(3);
    });

    it("clicks a pagination page", () => {
      wrapper
        .find(".Carousel--pagination Button")
        .at(1)
        .simulate("click");
    });

    it("calls onSlideChange prop with expected payload", () => {
      expect(component.props.onSlideChange).toHaveBeenCalledTimes(1);
      expect(component.props.onSlideChange).toHaveBeenCalledWith(1);
    });

    it("changes the current slide", () => {
      // @ts-ignore-next-line
      expect(wrapper.find(".Carousel--slides").prop("style").transform).toBe(
        "translate3d(-100%, 0, 0)"
      );
      expect(
        wrapper
          .find(".Carousel--pagination Button")
          .at(1)
          .hasClass("isSelected")
      ).toBe(true);
    });

    it("receives new props", () => {
      wrapper.setProps({ currentIndex: 2 }).update();
    });

    it("changes the current slide", () => {
      // @ts-ignore-next-line
      expect(wrapper.find(".Carousel--slides").prop("style").transform).toBe(
        "translate3d(-200%, 0, 0)"
      );
      expect(
        wrapper
          .find(".Carousel--pagination Button")
          .at(2)
          .hasClass("isSelected")
      ).toBe(true);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when there's only one child", () => {
    const wrapper = component
      .withChildren([<div className="Slide" key="slide-1" />])
      .render();

    it("renders all of the children", () => {
      expect(wrapper.find(".Slide")).toHaveLength(1);
    });

    it("doesn't render the pagination", () => {
      expect(wrapper.find(".Carousel--pagination")).toHaveLength(0);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
