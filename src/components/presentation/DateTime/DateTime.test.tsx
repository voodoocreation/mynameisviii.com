import { render } from "enzyme";
import * as React from "react";

import DateTime from "./DateTime";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestDateTime",
    value: "2018-10-20T20:00:00",
    ...fromTestProps
  };

  return {
    actual: fn(<DateTime {...props} />),
    props
  };
};

describe("[presentation] <DateTime />", () => {
  it("renders correctly with minimum props", () => {
    const { actual, props } = setup(render);

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("Saturday, October 20, 2018, 8:00 PM");
    expect(actual.text()).toBe("in 10 months");
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when isDateOnly=true", () => {
    const { actual, props } = setup(render, { isDateOnly: true });

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("Saturday, October 20, 2018");
    expect(actual.text()).toBe("in 10 months");
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when isRelative=false", () => {
    const { actual, props } = setup(render, {
      isRelative: false
    });

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("Saturday, October 20, 2018, 8:00 PM");
    expect(actual.text()).toBe("Saturday, October 20, 2018, 8:00 PM");
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when isRelative=false", () => {
    const { actual, props } = setup(render, {
      isDateOnly: true,
      isRelative: false
    });

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("Saturday, October 20, 2018");
    expect(actual.text()).toBe("Saturday, October 20, 2018");
    expect(actual).toMatchSnapshot();
  });

  it("only renders the time when isRelative=false and options are set", () => {
    const { actual, props } = setup(render, {
      isRelative: false,
      options: {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
      }
    });

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("8:00 PM");
    expect(actual.text()).toBe("8:00 PM");
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when value doesn't include the time ", () => {
    const { actual, props } = setup(render, {
      isDateOnly: true,
      value: "2018-10-20"
    });

    expect(actual.attr("datetime")).toBe(props.value);
    expect(actual.attr("title")).toBe("Saturday, October 20, 2018");
    expect(actual.text()).toBe("in 10 months");
    expect(actual).toMatchSnapshot();
  });
});
