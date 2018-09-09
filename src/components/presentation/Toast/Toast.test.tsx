import { mount, render } from "enzyme";
import * as React from "react";

import Toast from "./Toast";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestToast",
    ...fromTestProps
  };

  return {
    actual: fn(<Toast {...props}>Test</Toast>),
    props
  };
};

describe("[presentation] <Toast />", () => {
  beforeEach(() => {
    window.setTimeout = jest.fn((fn: any) => {
      fn();
      return 1;
    });
    window.clearTimeout = jest.fn();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("closes when close button is clicked, then reopens when new props are passed", () => {
    const { actual } = setup(mount, {
      hasAutoDismiss: false,
      isVisible: true
    });

    expect(actual.find(".Toast")).toHaveLength(1);

    actual.find(".Toast-closeButton").simulate("click");
    expect(actual.find(".Toast")).toHaveLength(0);

    actual.setProps({ isVisible: true });
    expect(actual.find(".Toast")).toHaveLength(1);
  });

  it("calls `onClose` prop when it's defined when the close button is clicked", () => {
    const { actual, props } = setup(mount, {
      hasAutoDismiss: false,
      isVisible: true,
      onClose: jest.fn()
    });

    actual.find(".Toast-closeButton").simulate("click");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("doesn't throw an error when `onClose` prop isn't defined when the close button is clicked", () => {
    let isPassing = true;

    try {
      const { actual } = setup(mount, {
        hasAutoDismiss: false,
        isVisible: true
      });

      actual.find(".Toast-closeButton").simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  it("dismisses automatically when hasAutoDismiss=true", () => {
    const { actual } = setup(mount, { isVisible: true });

    actual.setProps({ isVisible: true });

    expect(window.setTimeout).toHaveBeenCalledTimes(6);
    expect(window.clearTimeout).toHaveBeenCalledTimes(3);
  });
});
