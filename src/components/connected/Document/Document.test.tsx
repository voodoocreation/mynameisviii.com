import { render } from "enzyme";
import merge from "lodash.merge";
import * as React from "react";

import Document from "./Document";

const setup = async (fn: any, fromTestProps?: any) => {
  const context = merge(
    {
      __NEXT_DATA__: {
        buildId: "buildId",
        page: "/",
        pathname: "pathname"
      },
      assetPrefix: "/assetPrefix",
      dynamicImports: [],
      files: [],
      isServer: true,
      renderPage: async () => ({}),
      req: {
        locale: "en-NZ"
      }
    },
    fromTestProps
  );
  const initialProps = await Document.getInitialProps(context);
  const props = {
    ...context,
    ...initialProps
  };

  return {
    props,
    wrapper: fn(<Document {...props} />)
  };
};

const g: any = global;

describe("[connected] <Document />", () => {
  beforeEach(() => {
    // @ts-ignore-next-line
    process.env.NODE_ENV = "development";
    g.isServer = true;
  });

  it("renders correctly when NODE_ENV=development", async () => {
    // @ts-ignore-next-line
    process.env.NODE_ENV = "development";
    const { wrapper } = await setup(render);

    expect(wrapper).toMatchSnapshot();
  });

  it("renders currectly when NODE_ENV=production", async () => {
    // @ts-ignore-next-line
    process.env.NODE_ENV = "production";
    const { wrapper } = await setup(render);

    expect(wrapper).toMatchSnapshot();
  });

  it("renders currectly when locale is missing", async () => {
    const { wrapper } = await setup(render, {
      req: { locale: "" }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
