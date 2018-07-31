import { mount, render } from "enzyme";
import moment from "moment";
import * as React from "react";

import Appearance from "./Appearance";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    acts: [
      {
        genre: "act genre",
        imageUrl: "act imageUrl",
        location: {
          address: "act location address"
        },
        name: "act name"
      }
    ],
    description: "description",
    finishingAt: "2018-10-10T20:00:00",
    imageUrl: "imageUrl",
    images: [],
    isActive: true,
    location: {
      latLng: "location latLng",
      name: "location name",
      type: "location type"
    },
    organizer: {
      name: "organizer name"
    },
    sales: [],
    startingAt: "2018-10-10T18:00:00",
    ...fromTestProps
  };

  return {
    actual: fn(<Appearance {...props} />),
    props
  };
};

describe("[presentation] <Appearance />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when status=EventCancelled", () => {
    const { actual } = setup(render, {
      status: "EventCancelled"
    });

    expect(actual.hasClass("isCancelled")).toBe(true);
    expect(actual.find(".Appearance-tickets")).toHaveLength(0);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when status=EventPostponed", () => {
    const { actual } = setup(render, {
      status: "EventPostponed"
    });

    expect(actual.hasClass("isPostponed")).toBe(true);
    expect(actual.find(".Appearance-tickets")).toHaveLength(0);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when finishingAt < now", () => {
    const { actual } = setup(render, {
      finishingAt: moment()
        .utc()
        .subtract(1, "days")
        .format('YYYY-MM-DDTHH:mm:ss')
    });

    expect(actual.hasClass("isFinished")).toBe(true);
    expect(actual.find(".Appearance-tickets")).toHaveLength(0);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with all props", () => {
    const { actual } = setup(render, {
      audience: "audience",
      images: [
        {
          imageUrl: "images 1 imageUrl",
          title: "images 1 title"
        },
        {
          imageUrl: "images 2 imageUrl",
          title: "images 2 title"
        }
      ],
      location: {
        address: "location address"
      },
      locationLatLng: { lat: "lat", lng: "lng" },
      organizer: {
        email: "organizer email",
        logo: "organizer logo",
        name: "organizer name"
      },
      sales: [
        {
          availability: "sales 1 availability",
          name: "sales 1 name",
          price: "sales 1 price",
          priceCurrency: "NZD"
        }
      ]
    });
    expect(actual).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has loaded", () => {
    const { actual } = setup(mount);

    actual.find(".Appearance-image img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find(".Appearance-image img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers `onGalleryInteraction` prop when interacting with the gallery", () => {
    const { actual, props } = setup(mount, {
      images: [
        {
          imageUrl: "images 1 imageUrl",
          title: "images 1 title"
        }
      ],
      onGalleryInteraction: jest.fn()
    });

    actual
      .find("Image")
      .first()
      .simulate("click");
    expect(props.onGalleryInteraction).toHaveBeenCalledWith("itemClick", 0);
  });

  it("doesn't throw an error when `onGalleryInteraction` prop is undefined and the gallery is interacted with", () => {
    let isPassing = true;
    const { actual } = setup(mount, {
      images: [
        {
          imageUrl: "images 1 imageUrl",
          title: "images 1 title"
        }
      ]
    });

    try {
      actual
        .find("Image")
        .first()
        .simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });
});
