import { render } from "enzyme";
import * as React from "react";

import Meta from "./Meta";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestMeta",
    label: "Test label",
    ...fromTestProps
  };

  return {
    actual: fn(<Meta {...props}>Meta value</Meta>),
    props
  };
};

describe("[presentation] <Meta />", () => {
  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });
});
