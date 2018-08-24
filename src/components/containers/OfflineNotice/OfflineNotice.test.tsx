import { render } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";

import createStore from "../../../store/root.store";
import OfflineNotice from "./OfflineNotice";

const setup = (fn: any, fromTestStore = {}) => {
  const store = createStore({
    page: {
      isOnline: false
    },
    ...fromTestStore
  });

  return {
    actual: fn(
      <Provider store={store}>
        <OfflineNotice />
      </Provider>
    ),
    store
  };
};

describe("[containers] <OfflineNotice />", () => {
  it("renders correctly when offline", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders null when online", () => {
    const { actual } = setup(render, {
      page: {
        isOnline: true
      }
    });
    expect(actual).toMatchSnapshot();
  });
});
