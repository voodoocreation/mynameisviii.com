import { mount, render } from "enzyme";
import * as React from "react";

import Carousel from "./Carousel";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestCarousel",
    ...fromTestProps
  };

  return {
    actual: fn(
      <Carousel {...props}>
        <div className="Slide-1" />
        <div className="Slide-2" />
        <div className="Slide-3" />
      </Carousel>
    ),
    props
  };
};

describe("[presentation] <Carousel />", () => {
  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("selects correct initial slide when `currentIndex` prop is passed", () => {
    const { actual } = setup(render, { currentIndex: 1 });

    expect(actual.find(".Carousel-slides").prop("style").transform).toBe(
      "translate3d(-100%, 0, 0)"
    );
    expect(actual.find(".Carousel-page.isSelected").text()).toBe("2");
    expect(actual).toMatchSnapshot();
  });

  it("changes to correct slide when new `currentIndex` prop is passed", () => {
    const { actual } = setup(mount, { onSlideChange: jest.fn() });

    expect(actual.find(".Carousel-page.isSelected").text()).toBe("1");
    actual.setProps({ currentIndex: 1 }).update();
    expect(actual.find(".Carousel-slides").prop("style").transform).toBe(
      "translate3d(-100%, 0, 0)"
    );
    expect(actual.find(".Carousel-page.isSelected").text()).toBe("2");
  });

  it("triggers `onSlideChange` prop on interaction", () => {
    const { actual, props } = setup(mount, { onSlideChange: jest.fn() });

    actual
      .find(".Carousel-page")
      .last()
      .simulate("click");
    expect(props.onSlideChange).toHaveBeenCalledWith(2);
  });

  it("doesn't throw an error when `onSlideChange` prop is undefined and the carousel is interacted with", () => {
    let isPassing = true;
    const { actual } = setup(mount);

    try {
      actual
        .find(".Carousel-page")
        .last()
        .simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });
});
