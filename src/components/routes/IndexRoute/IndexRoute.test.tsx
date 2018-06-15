import { render } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";

import Index from "./IndexRoute";

jest.mock("react-redux", () => ({
  connect: () => (component: any) => component
}));

const setup = (fn: any) => {
  const props = {
    articles: []
  };

  return {
    actual: fn(<Index {...props} />),
    props
  };
};

describe("<Index />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(toJson(actual)).toMatchSnapshot();
  });
});
