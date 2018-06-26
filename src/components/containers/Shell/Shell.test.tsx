import { render } from "enzyme";
import * as React from "react";

import Shell from "./Shell";

jest.mock("react-redux", () => ({
  connect: () => (component: any) => component
}));

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestClassName",
    ...fromTestProps
  };

  return {
    actual: fn(<Shell {...props} />),
    props
  };
};

describe("<Shell />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when loading", () => {
    const { actual } = setup(render, {
      isLoading: true
    });
    expect(actual).toMatchSnapshot();
  });
});
