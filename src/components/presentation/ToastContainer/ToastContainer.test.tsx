import { render } from "enzyme";
import * as React from "react";

import ToastContainer from "./ToastContainer";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestToastContainer",
    ...fromTestProps
  };

  return {
    actual: fn(<ToastContainer {...props} />),
    props
  };
};

describe("[presentation] <ToastContainer />", () => {
  it("renders correctly with children", () => {
    const { actual } = setup(render, { children: <div>Test</div> });

    expect(actual.find("div")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("renders null with no children", () => {
    const { actual } = setup(render);

    expect(actual.find(".ToastContainer")).toHaveLength(0);
    expect(actual).toMatchSnapshot();
  });
});
