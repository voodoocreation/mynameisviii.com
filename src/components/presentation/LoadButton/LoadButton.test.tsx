import { findCall } from "jest-mocks";

import messages from "../../../locales/en-NZ";
import { createMockElement } from "../../../utilities/mocks";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import LoadButton from "./LoadButton";

const screenWidth = 1920;
const screenHeight = 1080;

const component = new WrapperWithIntl(LoadButton).withDefaultProps({
  className: "TestLoadButton",
  onLoad: jest.fn(),
});

describe("[presentation] <LoadButton />", () => {
  jest.spyOn(window, "addEventListener");
  jest.spyOn(window, "removeEventListener");

  Object.defineProperties(window, {
    innerHeight: {
      value: screenHeight,
      writable: true,
    },
    innerWidth: {
      value: screenWidth,
      writable: true,
    },
    isServer: {
      value: false,
      writable: true,
    },
  });

  describe("when mounting on the client and isScrollLoadEnabled is false", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      wrapper = component
        .withProps({
          isScrollLoadEnabled: false,
        })
        .mount();
    });

    it("doesn't bind scroll event listener", () => {
      expect(
        findCall(window.addEventListener as jest.Mock, "scroll")
      ).toBeUndefined();
    });

    it("doesn't call the onLoad prop", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("clicks the button", () => {
      wrapper.simulate("click");
    });

    it("calls the onLoad prop", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("unmounts component", () => {
      wrapper.unmount();
    });

    it("doesn't unbind scroll event listener", () => {
      expect(
        findCall(window.removeEventListener as jest.Mock, "scroll")
      ).toBeUndefined();
    });
  });

  describe("when mounting on the client and isScrollLoadEnabled is true", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      wrapper = component
        .withProps({
          isScrollLoadEnabled: true,
          triggerDistance: 200,
        })
        .mount();
    });

    it("binds scroll event listener", () => {
      expect(
        findCall(window.addEventListener as jest.Mock, "scroll")
      ).toBeDefined();
    });

    it("calls the onLoad prop instantly", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("simulate positioning the button off the screen", () => {
      wrapper
        .find("LoadButton")
        // @ts-ignore-next-line
        .instance().buttonRef.current = createMockElement(
        100,
        100,
        screenHeight + component.props.triggerDistance!,
        0
      );
    });

    it("dispatches a scroll event", () => {
      window.dispatchEvent(new UIEvent("scroll"));
    });

    it("doesn't call the onLoad prop", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("simulate positioning the button within the trigger distance of the screen", () => {
      wrapper
        .find("LoadButton")
        // @ts-ignore-next-line
        .instance().buttonRef.current = createMockElement(
        100,
        100,
        screenHeight + component.props.triggerDistance! - 1,
        0
      );
    });

    it("dispatches a scroll event", () => {
      window.dispatchEvent(new UIEvent("scroll"));
    });

    it("calls the onLoad prop", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("updates the props to set isScrollLoadEnabled to false", () => {
      wrapper.setProps({
        isScrollLoadEnabled: false,
      });
    });

    it("unbinds the scroll event listener", () => {
      expect(
        findCall(window.removeEventListener as jest.Mock, "scroll")
      ).toBeDefined();
    });

    it("updates the props to set isScrollLoadEnabled to true again", () => {
      wrapper.setProps({
        isScrollLoadEnabled: true,
      });
    });

    it("unbinds the scroll event listener", () => {
      expect(
        findCall(window.addEventListener as jest.Mock, "scroll")
      ).toBeDefined();
    });

    it("calls the onLoad prop", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(1);
    });

    it("clears mocks", () => {
      jest.clearAllMocks();
    });

    it("unmounts component", () => {
      wrapper.unmount();
    });

    it("unbinds scroll event listener", () => {
      expect(
        findCall(window.removeEventListener as jest.Mock, "scroll")
      ).toBeDefined();
    });
  });

  describe("when mounting on the server and isScrollLoadEnabled is true", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();

      Object.defineProperty(window, "isServer", {
        value: true,
        writable: true,
      });

      wrapper = component
        .withProps({
          isScrollLoadEnabled: true,
          triggerDistance: 200,
        })
        .mount();
    });

    it("doesn't bind scroll event listener", () => {
      expect(
        findCall(window.addEventListener as jest.Mock, "scroll")
      ).toBeUndefined();
    });

    it("doesn't call the onLoad prop instantly", () => {
      expect(component.props.onLoad).toHaveBeenCalledTimes(0);
    });

    it("updates the props to set isScrollLoadEnabled to false", () => {
      wrapper.setProps({
        isScrollLoadEnabled: false,
      });
    });

    it("doesn't unbind the scroll event listener", () => {
      expect(
        findCall(window.removeEventListener as jest.Mock, "scroll")
      ).toBeUndefined();
    });

    it("updates the props to set isScrollLoadEnabled to true again", () => {
      wrapper.setProps({
        isScrollLoadEnabled: true,
      });
    });

    it("doesn't unbind the scroll event listener", () => {
      expect(
        findCall(window.addEventListener as jest.Mock, "scroll")
      ).toBeUndefined();
    });
  });

  it("renders children within the button when they're defined", () => {
    const wrapper = component.withChildren("Load button").render();

    expect(wrapper.text()).toBe("Load button");
  });

  it("renders LOAD_MORE within the button when no children are defined and hasError is false", () => {
    const wrapper = component
      .withProps({
        hasError: false,
        isLoading: false,
      })
      .render();

    expect(wrapper.text()).toBe(messages.LOAD_MORE);
  });

  it("renders TRY_AGAIN within the button when no children are defined and hasError is true", () => {
    const wrapper = component
      .withProps({
        hasError: true,
        isLoading: false,
      })
      .render();

    expect(wrapper.text()).toBe(messages.TRY_AGAIN);
  });

  it("renders a Loader when isLoading is true", () => {
    const wrapper = component
      .withProps({
        isLoading: true,
      })
      .mount();

    expect(wrapper.find("Loader")).toHaveLength(1);
  });
});
