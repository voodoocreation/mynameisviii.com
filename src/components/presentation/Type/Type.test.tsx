import { render } from "enzyme";
import * as React from "react";

import Type from "./Type";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestType",
    value: "news",
    ...fromTestProps
  };

  return {
    actual: fn(<Type {...props} />),
    props
  };
};

describe("[presentation] <Type />", () => {
  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly without label", () => {
    const { actual } = setup(render, { hasLabel: false });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when value=release", () => {
    const { actual } = setup(render, { value: "release" });
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when value=appearance", () => {
    const { actual } = setup(render, { value: "appearance" });

    expect(actual).toMatchSnapshot();
  });
});
