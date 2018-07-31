import { mount, render } from "enzyme";
import * as React from "react";

import Release from "./Release";

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
    actual: fn(<Release {...props} />),
    props
  };
};

describe("[presentation] <Release />", () => {
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

  it("renders correctly when productionType=compilation", () => {
    const { actual } = setup(render, { productionType: "compilation" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when productionType=demo", () => {
    const { actual } = setup(render, { productionType: "demo" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when productionType=live", () => {
    const { actual } = setup(render, { productionType: "live" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when productionType=remix", () => {
    const { actual } = setup(render, { productionType: "remix" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when productionType=soundtrack", () => {
    const { actual } = setup(render, { productionType: "soundtrack" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when type=ep", () => {
    const { actual } = setup(render, { type: "ep" });

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when type=single", () => {
    const { actual } = setup(render, { type: "single" });

    expect(actual).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has loaded", () => {
    const { actual } = setup(mount);

    actual.find(".Release-images img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find(".Release-images img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers `onCarouselSlideChange` prop when interacting with the carousel", () => {
    const { actual, props } = setup(mount, {
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
      onCarouselSlideChange: jest.fn()
    });

    actual
      .find(".Carousel-page")
      .last()
      .simulate("click");
    expect(props.onCarouselSlideChange).toHaveBeenCalledWith(1);
  });

  it("doesn't throw an error when `onCarouselSlideChange` prop is undefined and the carousel is interacted with", () => {
    let isPassing = true;
    const { actual } = setup(mount, {
      images: [
        {
          imageUrl: "images 1 imageUrl",
          title: "images 1 title"
        },
        {
          imageUrl: "images 2 imageUrl",
          title: "images 2 title"
        }
      ]
    });

    try {
      actual
        .find(".Carousel-page")
        .last()
        .simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });
});
