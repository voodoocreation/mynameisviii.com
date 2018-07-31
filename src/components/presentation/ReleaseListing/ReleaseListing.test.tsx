import { mount, render } from "enzyme";
import * as React from "react";

import ReleaseListing from "./ReleaseListing";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    artist: {
      name: "artist name",
      url: "artist url"
    },
    buyList: [],
    description: "description",
    genre: "genre",
    images: [
      {
        imageUrl: "images 1 imageUrl",
        title: "images 1 title"
      }
    ],
    isActive: true,
    length: "5:00",
    productionType: "productionType",
    recordLabel: "recordLabel",
    releasedOn: "2017-01-01T00:00:00",
    slug: "slug",
    streamList: [],
    title: "title",
    tracklist: [
      [
        {
          genre: "tracklist 1 genre",
          length: "5:00",
          title: "tracklist 1 title",
          url: "tracklist 1 url"
        }
      ]
    ],
    type: "type",
    ...fromTestProps
  };

  return {
    actual: fn(<ReleaseListing {...props} />),
    props
  };
};

describe("[presentation] <ReleaseListing />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with all props", () => {
    const { actual } = setup(render, {
      buyList: [{ platform: "itunes", url: "buyList 1 url" }],
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
      streamList: [{ platform: "spotify", url: "streamList 1 url" }],
      tracklist: [
        [
          {
            genre: "tracklist 1.1 genre",
            length: "5:00",
            title: "tracklist 1.1 title",
            url: "tracklist 1.1 url"
          },
          {
            genre: "tracklist 1.2 genre",
            length: "5:00",
            title: "tracklist 1.2 title",
            url: "tracklist 1.2 url"
          }
        ],
        [
          {
            genre: "tracklist 2.1 genre",
            length: "5:00",
            title: "tracklist 2.1 title",
            url: "tracklist 2.1 url"
          },
          {
            genre: "tracklist 2.2 genre",
            length: "5:00",
            title: "tracklist 2.2 title",
            url: "tracklist 2.2 url"
          }
        ]
      ]
    });

    expect(actual).toMatchSnapshot();
  });

  it("updates `isRendered` state after image has loaded", () => {
    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers `onLoad` prop after image has loaded", () => {
    const { actual, props } = setup(mount, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
  });

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });
});
