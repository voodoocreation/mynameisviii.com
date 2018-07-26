import { mount, render } from "enzyme";
import * as React from "react";

import AppearanceListing from "./AppearanceListing";

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
    actual: fn(<AppearanceListing {...props} />),
    props
  };
};

describe("[presentation] <AppearanceListing />", () => {
  beforeEach(() => {
    g.isServer = false;

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
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when status=EventPostponed", () => {
    const { actual } = setup(render, {
      status: "EventPostponed"
    });
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with all props", () => {
    const { actual } = setup(render, {
      audience: "audience",
      images: [
        {
          imageUrl: "images 1 imageUrl",
          title: "images 1 title"
        }
      ],
      location: {
        address: "location address"
      },
      locationLatLng: { lat: "lat", lng: "lng" },
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

  it("updates `isRendered` state after image has loaded", () => {
    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers onLoad prop after image has loaded", () => {
    const { actual, props } = setup(mount, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
  });

  it("updates `isRendered` state and triggers onLoad prop when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual, props } = setup(mount, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
    expect(actual.render()).toMatchSnapshot();
  });
});
