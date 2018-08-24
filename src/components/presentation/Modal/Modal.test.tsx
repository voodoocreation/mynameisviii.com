import { mount } from "enzyme";
import * as React from "react";

import * as dom from "../../../helpers/dom";
import Modal from "./Modal";

jest.mock("react-dom", () => ({
  createPortal: (component: any) => component
}));

let isInPortalValue = true;
Object.defineProperty(dom, "isInPortal", {
  value: jest.fn(() => isInPortalValue)
});

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestModal",
    isOpen: true,
    onClose: jest.fn(),
    usePortal: false,
    ...fromTestProps
  };

  return {
    actual: fn(
      <Modal {...props}>
        <div className="Modal-testContent">
          <span>Modal content</span>
          <button>Modal button</button>
        </div>
      </Modal>
    ),
    props
  };
};

const g: any = global;
const addEventListener = g.addEventListener;
const removeEventListener = g.removeEventListener;

describe("[presentation] <Modal />", () => {
  beforeAll(() => {
    g.addEventListener = jest.fn((...args) => addEventListener(...args));
    g.removeEventListener = jest.fn((...args) => removeEventListener(...args));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    g.addEventListener = addEventListener;
    g.removeEventListener = removeEventListener;
  });

  it("renders correctly", () => {
    const { actual } = setup(mount);

    expect(actual.find(".Portal-inPlace")).toHaveLength(1);
    expect(actual.render()).toMatchSnapshot();
  });

  it("renders correctly when usePortal=true", () => {
    const { actual } = setup(mount, { usePortal: true });

    expect(actual.render()).toMatchSnapshot();
  });

  it("renders correctly when isOpen=false", () => {
    const { actual } = setup(mount, { isOpen: false });

    expect(actual.find("div")).toHaveLength(0);
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers `onClose` prop when hasOverlayClick=true and overlay is clicked on", () => {
    const { actual, props } = setup(mount);

    actual.find(".Modal-overlay").simulate("click");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("doesn't trigger `onClose` prop when hasOverlayClick=false and overlay is clicked on", () => {
    const { actual, props } = setup(mount, {
      hasOverlayClick: false
    });

    actual.find(".Modal-overlay").simulate("click");
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("triggers `onClose` prop when escape key is pressed", () => {
    const { props } = setup(mount);

    window.dispatchEvent(new KeyboardEvent("keypress", { key: "Escape" }));
    expect(props.onClose).toHaveBeenCalled();
  });

  describe("focus restriction", () => {
    it("prevents elements outside of the modal from gaining focus when hasFocusRestriction=true", () => {
      isInPortalValue = false;
      setup(mount, { usePortal: true });
      const event = new FocusEvent("focus");
      event.stopPropagation = jest.fn();

      expect(g.findMockCall(g.addEventListener, "focus")).toBeDefined();
      document.body.dispatchEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("allows elements within the modal to gain focus when hasFocusRestriction=true", () => {
      isInPortalValue = true;
      const { actual } = setup(mount, { usePortal: true });
      const event = new FocusEvent("focus");
      Object.defineProperty(event, "target", {
        value: actual.find(".Modal-testContent button").getDOMNode()
      });
      event.stopPropagation = jest.fn();

      expect(g.findMockCall(g.addEventListener, "focus")).toBeDefined();
      window.dispatchEvent(event);
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it("doesn't attempt to manage focus after `hasFocusRestriction` has been changed from true to false", () => {
      const { actual } = setup(mount, { usePortal: true });
      const event = new FocusEvent("focus");
      event.stopPropagation = jest.fn();

      expect(g.findMockCall(g.addEventListener, "focus")).toBeDefined();
      actual.setProps({ hasFocusRestriction: false });
      document.body.dispatchEvent(event);
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe("window event binding", () => {
    it("binds all events onShow", () => {
      setup(mount);

      expect(g.findMockCall(g.addEventListener, "focus")).toBeDefined();
      expect(g.findMockCall(g.addEventListener, "keypress")).toBeDefined();
    });

    it("doesn't bind focus event when hasFocusRestriction=false onShow", () => {
      setup(mount, { hasFocusRestriction: false });

      expect(g.findMockCall(g.addEventListener, "focus")).toBeUndefined();
    });

    it("unbinds all events when component unmounts", () => {
      const { actual } = setup(mount);

      expect(g.findMockCall(g.addEventListener, "focus")).toBeDefined();
      expect(g.findMockCall(g.addEventListener, "keypress")).toBeDefined();

      actual.unmount();

      expect(g.findMockCall(g.removeEventListener, "focus")).toBeDefined();
      expect(g.findMockCall(g.removeEventListener, "keypress")).toBeDefined();
    });

    it("doesn't unbind focus event when component unmounts when hasFocusRestriction=false", () => {
      const { actual } = setup(mount, { hasFocusRestriction: false });

      actual.unmount();

      expect(g.findMockCall(g.removeEventListener, "focus")).toBeUndefined();
    });

    it("doesn't unbind anything when component unmounts when modal isn't open", () => {
      const { actual } = setup(mount, { isOpen: false });

      actual.unmount();

      expect(g.findMockCall(g.removeEventListener, "focus")).toBeUndefined();
      expect(g.findMockCall(g.removeEventListener, "keypress")).toBeUndefined();
    });
  });
});
