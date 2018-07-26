import { render } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";

import Brand from "./Brand";

const setup = (fn: any) => ({
  actual: fn(<Brand />)
});

describe("[presentation] <Brand />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(toJson(actual)).toMatchSnapshot();
  });
});
