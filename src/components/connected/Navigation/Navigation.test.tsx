import { mount, render } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";

import createStore from "../../../store/root.store";
import Navigation from "./Navigation";

const setup = (fn: any) => {
  const store = createStore({
    page: {
      isNavOpen: false
    }
  });

  return {
    actual: fn(
      <Provider store={store}>
        <Navigation />
      </Provider>
    ),
    store
  };
};

describe("[containers] <Navigation />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("toggles navigation correctly when menu button is clicked", () => {
    const { actual, store } = setup(mount);
    const button = actual.find("button");

    button.simulate("click");
    expect(store.getState().page.isNavOpen).toBe(true);
    expect(actual.find(".isOpen")).toHaveLength(1);

    button.simulate("click");
    expect(store.getState().page.isNavOpen).toBe(false);
    expect(actual.find(".isOpen")).toHaveLength(0);
  });
});
