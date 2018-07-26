import { mount, render, shallow } from "enzyme";
import * as React from "react";

import LoadButton from "./LoadButton";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestLoadButton",
    onLoad: jest.fn(),
    ...fromTestProps
  };

  return {
    actual: fn(<LoadButton {...props}>Load button</LoadButton>),
    props
  };
};

const g: any = global;
const screenWidth = 1920;
const screenHeight = 1080;
const addEventListener = g.addEventListener;
const removeEventListener = g.removeEventListener;

describe("[presentation] <LoadButton />", () => {
  beforeEach(() => {
    g.innerWidth = screenWidth;
    g.innerHeight = screenHeight;
    g.isServer = false;
    g.addEventListener = jest.fn((...args) => addEventListener(...args));
    g.removeEventListener = jest.fn((...args) => removeEventListener(...args));
  });

  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("triggers `onLoad` prop when button is clicked", () => {
    const { actual, props } = setup(shallow, { isScrollLoadEnabled: false });

    actual.simulate("click");

    expect(props.onLoad).toHaveBeenCalledTimes(1);
  });

  it("attempts automatic load on window scroll when the button is almost in view", () => {
    const { actual, props } = setup(mount);

    actual.instance().buttonRef.current.buttonNode = g.mockElement(
      100,
      100,
      0,
      0
    );
    g.dispatchEvent(new UIEvent("scroll"));

    expect(props.onLoad).toHaveBeenCalledTimes(2);
  });

  it("doesn't attempt automatic load on window scroll when the button isn't almost in view", () => {
    const { actual, props } = setup(mount, { isScrollLoadEnabled: false });

    actual.instance().buttonRef.current.buttonNode = g.mockElement(
      100,
      100,
      screenHeight + 50,
      0
    );
    actual.setProps({ isScrollLoadEnabled: true });
    g.dispatchEvent(new UIEvent("scroll"));

    expect(props.onLoad).not.toHaveBeenCalledTimes(1);
  });

  describe("window scroll event binding", () => {
    it("binds when isScrollLoadEnabled=true", () => {
      setup(shallow);

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeDefined();
    });

    it("doesn't bind when isScrollLoadEnabled=false", () => {
      setup(shallow, { isScrollLoadEnabled: false });

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeUndefined();
    });

    it("binds when `isScrollLoadEnabled` changes from false to true", () => {
      const { actual } = setup(shallow, { isScrollLoadEnabled: false });

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeUndefined();
      actual.setProps({ isScrollLoadEnabled: true });
      expect(g.findMockCall(g.addEventListener, "scroll")).toBeDefined();
    });

    it("unbinds when `isScrollLoadEnabled` changes from true to false", () => {
      const { actual } = setup(shallow, { isScrollLoadEnabled: true });

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeDefined();
      actual.setProps({ isScrollLoadEnabled: false });
      expect(g.findMockCall(g.removeEventListener, "scroll")).toBeDefined();
    });

    it("unbinds when component unmounts", () => {
      const { actual } = setup(shallow);

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeDefined();
      actual.unmount();
      expect(g.findMockCall(g.removeEventListener, "scroll")).toBeDefined();
    });

    it("doesn't unbind when component unmounts and isScrollLoadEnabled=false", () => {
      const { actual } = setup(shallow, { isScrollLoadEnabled: false });

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeUndefined();
      actual.unmount();
      expect(g.findMockCall(g.removeEventListener, "scroll")).toBeUndefined();
    });

    it("doesn't try to bind/unbind when rendering on the server", () => {
      g.isServer = true;
      const { actual } = setup(shallow, { isScrollLoadEnabled: false });

      expect(g.findMockCall(g.addEventListener, "scroll")).toBeUndefined();
      actual.setProps({ isScrollLoadEnabled: true });
      expect(g.findMockCall(g.addEventListener, "scroll")).toBeUndefined();
    });
  });
});
