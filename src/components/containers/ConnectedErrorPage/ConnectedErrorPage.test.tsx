import { render } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";

import createStore from "../../../store/root.store";
import ConnectedErrorPage from "./ConnectedErrorPage";

const setup = (fn: any) => {
  const props = {
    error: {
      message: "Not found",
      status: 404
    }
  };
  const store = createStore();

  return {
    actual: fn(
      <Provider store={store}>
        <ConnectedErrorPage {...props} />
      </Provider>
    ),
    props
  };
};

describe("<ConnectedErrorPage />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });
});
