import { render } from "enzyme";
import * as React from "react";

import SymbolRoute from "./SymbolRoute";

const setup = (fn: any) => {
  return {
    actual: fn(<SymbolRoute />)
  };
};

describe("[routes] <SymbolRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });
});
