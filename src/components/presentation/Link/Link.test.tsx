import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";

import Link from "./Link";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    href: "/",
    router: {
      components: { test: "test" }
    },
    ...fromTestProps
  };

  return {
    actual: fn(<Link {...props}>Link</Link>),
    props
  };
};

describe("<Link />", () => {
  it("renders next.js <Link /> when page is ok", () => {
    const { actual } = setup(shallow);

    expect(toJson(actual)).toMatchSnapshot();
  });

  it("renders <a /> when page is an error", () => {
    const { actual } = setup(shallow, {
      router: {
        components: {}
      }
    });

    expect(toJson(actual)).toMatchSnapshot();
  });
});
