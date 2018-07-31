import { render } from "enzyme";
import * as React from "react";

import Meta from "./Meta";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestMeta",
    ...fromTestProps
  };

  return {
    actual: fn(<Meta {...props}>Meta value</Meta>),
    props
  };
};

describe("[presentation] <Meta />", () => {
  it("renders correctly with `label` prop", () => {
    const { actual } = setup(render, { label: "Test label" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with `labelConstant` prop", () => {
    const { actual } = setup(render, { labelConstant: "GENRE" });

    expect(actual).toMatchSnapshot();
  });
});
