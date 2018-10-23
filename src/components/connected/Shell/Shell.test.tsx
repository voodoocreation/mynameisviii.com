import { mount, render } from "enzyme";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import createStore from "../../../store/root.store";
import Shell from "./Shell";

const setup = (fn: any, fromTestProps?: any, fromTestStore?: any) => {
  const props = {
    className: "TestClassName",
    ...fromTestProps
  };
  const store = createStore(
    merge({
      page: { isLoading: false },
      ...fromTestStore
    })
  );

  return {
    actual: fn(
      <Provider store={store}>
        <Shell {...props} />
      </Provider>
    ),
    props,
    store
  };
};

describe("[connected] <Shell />", () => {
  it("renders correctly on the client", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly on the server", () => {
    window.isServer = true;
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when loading", () => {
    const { actual } = setup(
      render,
      {},
      {
        page: { isLoading: true }
      }
    );
    expect(actual).toMatchSnapshot();
  });

  it("renders new version toast and refreshes page when refresh button is clicked", () => {
    window.location.reload = jest.fn();
    const { actual } = setup(
      mount,
      {},
      {
        page: { hasNewVersion: true }
      }
    );

    const toast = actual.find("Toast.HasNewVersionToast");
    expect(toast).toHaveLength(1);

    toast.find("Button.HasNewVersionToast-refreshButton").simulate("click");
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });
});
