import { render } from "enzyme";
import * as React from "react";

import MetaBar from "./MetaBar";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestMetaBar",
    ...fromTestProps
  };

  return {
    actual: fn(<MetaBar {...props} />),
    props
  };
};

describe("[presentation] <MetaBar />", () => {
  it("renders null without children", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with children", () => {
    const { actual } = setup(render, { children: "Test meta bar" });
    expect(actual).toMatchSnapshot();
  });
});
