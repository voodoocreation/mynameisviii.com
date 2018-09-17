import { render } from "enzyme";
import * as React from "react";

import Gallery from "./Gallery";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    description: "description",
    imageUrl: "imageUrl",
    modifiedAt: "2017-10-10T18:00:00",
    slug: "slug",
    title: "title",
    ...fromTestProps
  };

  return {
    actual: fn(<Gallery {...props} />),
    props
  };
};

describe("[presentation] <Gallery />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });
});
