import { mount, render } from "enzyme";
import * as React from "react";

import ImageGallery from "./ImageGallery";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestGallery",
    usePortal: false,
    ...fromTestProps
  };

  return {
    actual: fn(
      <ImageGallery {...props}>
        <div className="Image-1" />
        <div className="Image-2" />
        <div className="Image-3" />
      </ImageGallery>
    ),
    props
  };
};

describe("[presentation] <ImageGallery />", () => {
  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("opens modal and shows correct item when an item is clicked", () => {
    const { actual } = setup(mount);

    actual.find(".Image-2").simulate("click");
    expect(actual.state("isOpen")).toBe(true);
    expect(actual.state("currentIndex")).toBe(1);
  });

  it("calls `onModalClose` prop when defined and the modal is closed", () => {
    const { actual, props } = setup(mount, { onModalClose: jest.fn() });

    actual.find(".Image-2").simulate("click");
    actual.find(".Modal-closeButton").simulate("click");
    expect(props.onModalClose).toHaveBeenCalled();
  });

  it("doesn't throw an error when `onModalClose` prop is undefined and the modal is closed", () => {
    let isPassing = true;
    const { actual } = setup(mount);

    try {
      actual.find(".Image-2").simulate("click");
      actual.find(".Modal-closeButton").simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  describe("keyboard events", () => {
    it("left arrow triggers previous() correctly", () => {
      const { actual } = setup(mount);

      actual.find(".Image-2").simulate("click");
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      expect(actual.state("currentIndex")).toBe(0);
    });

    it("right arrow triggers next() correctly", () => {
      const { actual } = setup(mount);

      actual.find(".Image-1").simulate("click");
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      expect(actual.state("currentIndex")).toBe(1);
    });
  });

  describe("goTo()", () => {
    it("updates `currentIndex` correctly", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(1);
      expect(actual.state("currentIndex")).toBe(1);
    });

    it("doesn't change `currentIndex` when requested item doesn't exist", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(3);
      expect(actual.state("currentIndex")).toBeUndefined();
    });

    it("calls `onGoTo` prop when defined", () => {
      const { actual, props } = setup(mount, { onGoTo: jest.fn() });

      actual.instance().goTo(2);
      expect(actual.state("currentIndex")).toBe(2);
      expect(props.onGoTo).toHaveBeenCalledWith(2);
    });
  });

  describe("previous()", () => {
    it("updates `currentIndex` correctly", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(2);
      actual.instance().previous();
      expect(actual.state("currentIndex")).toBe(1);
    });

    it("goes to first item when `currentIndex` is undefined", () => {
      const { actual } = setup(mount);

      actual.instance().previous();
      expect(actual.state("currentIndex")).toBe(0);
    });

    it("goes to last item when at the first item and isLooped=true", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(0);
      actual.instance().previous();
      expect(actual.state("currentIndex")).toBe(2);
    });

    it("doesn't change `currentIndex` when at the first item and isLooped=false", () => {
      const { actual } = setup(mount, { isLooped: false });

      actual.instance().goTo(0);
      actual.instance().previous();
      expect(actual.state("currentIndex")).toBe(0);
    });

    it("calls `onPrevious` prop when defined", () => {
      const { actual, props } = setup(mount, { onPrevious: jest.fn() });

      actual.instance().goTo(1);
      actual.instance().previous();
      expect(props.onPrevious).toHaveBeenCalledWith(0);
    });
  });

  describe("next()", () => {
    it("updates `currentIndex` correctly", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(0);
      actual.instance().next();
      expect(actual.state("currentIndex")).toBe(1);
    });

    it("goes to first item when `currentIndex` is undefined", () => {
      const { actual } = setup(mount);

      actual.instance().next();
      expect(actual.state("currentIndex")).toBe(0);
    });

    it("goes to first item when at the last item and isLooped=true", () => {
      const { actual } = setup(mount);

      actual.instance().goTo(2);
      actual.instance().next();
      expect(actual.state("currentIndex")).toBe(0);
    });

    it("doesn't change `currentIndex` when at the last item and isLooped=false", () => {
      const { actual } = setup(mount, { isLooped: false });

      actual.instance().goTo(2);
      actual.instance().next();
      expect(actual.state("currentIndex")).toBe(2);
    });

    it("calls `onNext` prop when defined", () => {
      const { actual, props } = setup(mount, { onNext: jest.fn() });

      actual.instance().goTo(1);
      actual.instance().next();
      expect(props.onNext).toHaveBeenCalledWith(2);
    });
  });
});
