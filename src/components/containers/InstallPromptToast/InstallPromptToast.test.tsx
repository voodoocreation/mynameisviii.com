import { mount, render } from "enzyme";
import moment from "moment";
import * as React from "react";

import InstallPromptToast from "./InstallPromptToast";

import * as ls from "../../../services/configureLocalStorage";

jest.mock("react-redux", () => ({
  connect: () => (component: any) => component
}));

jest.mock("../../../services/configureLocalStorage", () => ({
  getLocalStorage: jest.fn(() => ({ data: null, ok: true })),
  setLocalStorage: jest.fn(() => ({ data: null, ok: true }))
}));

const setup = (fn: any, fromTestProps: any = {}) => {
  const props = {
    trackEvent: jest.fn(),
    ...fromTestProps
  };
  return {
    actual: fn(<InstallPromptToast {...props} />),
    props
  };
};

describe("[containers] <InstallPromptToast />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders null initially", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("displays correctly when `beforeinstallprompt` event is fired", () => {
    const { actual } = setup(mount);

    const event: any = new Event("beforeinstallprompt");
    window.dispatchEvent(event);
    actual.update();

    expect(actual.find("Toast")).toHaveLength(1);
    expect(actual.render()).toMatchSnapshot();
    actual.unmount();
  });

  it("displays when the user has previously dismissed the toast over three days ago", () => {
    const getLocalStorage: any = ls.getLocalStorage;
    getLocalStorage.mockImplementationOnce(() => ({
      data: `${moment(new Date())
        .subtract(4, "days")
        .unix()}`,
      ok: true
    }));

    const { actual } = setup(mount);

    const event: any = new Event("beforeinstallprompt");
    window.dispatchEvent(event);
    actual.update();

    expect(actual.find("Toast")).toHaveLength(1);
    actual.unmount();
  });

  it("doesn't display when the user has previously dismissed the toast less than three days ago", () => {
    const getLocalStorage: any = ls.getLocalStorage;
    getLocalStorage.mockImplementationOnce(() => ({
      data: `${moment(new Date())
        .subtract(2, "days")
        .unix()}`,
      ok: true
    }));

    const { actual } = setup(mount);

    const event: any = new Event("beforeinstallprompt");
    window.dispatchEvent(event);
    actual.update();

    expect(actual.find("Toast")).toHaveLength(0);
    actual.unmount();
  });

  it("tracks event and dismisses toast correctly when the close button is clicked", () => {
    const { actual, props } = setup(mount);
    const setLocalStorage: any = ls.setLocalStorage;

    const event: any = new Event("beforeinstallprompt");
    window.dispatchEvent(event);
    actual.update();

    actual.find(".Toast-closeButton").simulate("click");

    expect(props.trackEvent).toHaveBeenCalledWith({
      event: "addToHomeScreen",
      outcome: "toast closed"
    });
    expect(setLocalStorage).toHaveBeenCalled();
    expect(setLocalStorage.mock.calls[0][0]).toBe("addToHomeScreen.dismissed");
    actual.unmount();
  });

  describe("when the install button is clicked", () => {
    it("hides the toast and prompts the user to install the app, then dismisses correctly when the user cancels the prompt", async () => {
      const { actual, props } = setup(mount);
      const setLocalStorage: any = ls.setLocalStorage;

      const event: any = new Event("beforeinstallprompt");
      event.prompt = jest.fn();
      event.userChoice = new Promise(resolve =>
        resolve({ outcome: "dismissed" })
      );
      window.dispatchEvent(event);
      actual.update();

      expect(event.prompt).not.toHaveBeenCalled();

      await actual
        .find(".Toast-installButton")
        .first()
        .simulate("click");

      expect(event.prompt).toHaveBeenCalled();
      expect(props.trackEvent).toHaveBeenCalledWith({
        event: "addToHomeScreen",
        outcome: "dismissed"
      });
      expect(setLocalStorage).toHaveBeenCalled();
      expect(setLocalStorage.mock.calls[0][0]).toBe(
        "addToHomeScreen.dismissed"
      );
      actual.unmount();
    });

    it("hides the toast and prompts the user to install the app, then dismisses correctly when the user accepts the prompt", async () => {
      const { actual, props } = setup(mount);
      const setLocalStorage: any = ls.setLocalStorage;

      const event: any = new Event("beforeinstallprompt");
      event.prompt = jest.fn();
      event.userChoice = new Promise(resolve =>
        resolve({ outcome: "accepted" })
      );
      window.dispatchEvent(event);
      actual.update();

      expect(event.prompt).not.toHaveBeenCalled();

      await actual
        .find(".Toast-installButton")
        .first()
        .simulate("click");

      expect(event.prompt).toHaveBeenCalled();
      expect(setLocalStorage).not.toHaveBeenCalled();
      expect(props.trackEvent).toHaveBeenCalledWith({
        event: "addToHomeScreen",
        outcome: "accepted"
      });
      actual.unmount();
    });
  });
});
