import { mount } from "enzyme";
import * as React from "react";

import Link from "./Link";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
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

describe("[presentation] <Link />", () => {
  it("renders <Routes.Link /> when router is available and `href` prop is passed", () => {
    const { actual } = setup(mount, { href: "/" });

    expect(actual.find("Link")).toHaveLength(2);
    expect(actual.find("a")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("renders <NextLink /> when router is available and `route` prop is passed", () => {
    const { actual } = setup(mount, { route: "/" });

    expect(actual.find("LinkRoutes")).toHaveLength(1);
    expect(actual.find("Link")).toHaveLength(2);
    expect(actual.find("a")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("renders <a /> when router is unavailable", () => {
    const { actual } = setup(mount, {
      href: "/",
      router: {
        components: {}
      }
    });

    expect(actual.find("Link")).toHaveLength(1);
    expect(actual.find("a")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("renders <span /> when `href` and `route` props are undefined", () => {
    const { actual } = setup(mount);

    expect(actual.find("Link")).toHaveLength(1);
    expect(actual.find("a")).toHaveLength(0);
    expect(actual.find("span")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });
});
