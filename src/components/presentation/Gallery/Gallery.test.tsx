import { mount, render } from "enzyme";
import * as React from "react";

import Gallery from "./Gallery";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    description: "description",
    imageUrl: "imageUrl",
    images: [
      { imageUrl: "images 1 imageUrl" },
      { imageUrl: "images 2 imageUrl" },
      { imageUrl: "images 3 imageUrl" }
    ],
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

  it("triggers `onGalleryInteraction` prop when interacting with the gallery", () => {
    const { actual, props } = setup(mount, {
      onGalleryInteraction: jest.fn()
    });

    actual
      .find("ImageGallery Image")
      .first()
      .simulate("click");
    expect(props.onGalleryInteraction).toHaveBeenCalledWith("itemClick", 0);
  });

  it("doesn't throw an error when `onGalleryInteraction` prop is undefined and the gallery is interacted with", () => {
    let isPassing = true;
    const { actual } = setup(mount);

    try {
      actual
        .find("ImageGallery Image")
        .first()
        .simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });
});
