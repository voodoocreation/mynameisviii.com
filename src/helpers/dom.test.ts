import * as dom from "./dom";

const g: any = global;

const mockElement = (width: number, height: number, top = 0, left = 0) => ({
  getBoundingClientRect: () => ({
    bottom: top + height,
    left,
    right: left + width,
    top
  })
});

const screenWidth = 1920;
const screenHeight = 1080;

describe("[helpers] DOM", () => {
  describe("isInViewport()", () => {
    const inside: any = {
      bottomLeft: mockElement(200, 200, screenHeight - 200),
      bottomRight: mockElement(200, 200, screenHeight - 200, screenWidth - 200),
      topLeft: mockElement(200, 200),
      topRight: mockElement(200, 200, 0, screenWidth - 200)
    };

    const outside: any = {
      bottomLeft: mockElement(200, 200, screenHeight - 199),
      bottomRight: mockElement(200, 200, screenHeight - 199, screenWidth - 199),
      topLeft: mockElement(200, 200, -1, -1),
      topRight: mockElement(200, 200, -1, screenWidth - 199)
    };

    it("returns false when an element isn't provided", () => {
      expect(dom.isInViewport()).toBe(false);
    });

    describe("on a browser that supports window.innerWidth and window.innerHeight", () => {
      beforeEach(() => {
        g.innerWidth = screenWidth;
        g.innerHeight = screenHeight;
      });

      it("returns true when entire element is within the viewport", () => {
        expect(dom.isInViewport(inside.topLeft)).toBe(true);
        expect(dom.isInViewport(inside.topRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomLeft)).toBe(true);
      });

      it("returns false when entire element is outside of the viewport", () => {
        expect(dom.isInViewport(outside.topLeft)).toBe(false);
        expect(dom.isInViewport(outside.topRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomLeft)).toBe(false);
      });
    });

    describe("on a browser that doesn't support window.innerWidth and window.innerHeight", () => {
      beforeEach(() => {
        g.innerWidth = undefined;
        g.innerHeight = undefined;

        Object.defineProperty(g.document.documentElement, "clientWidth", {
          value: screenWidth,
          writable: false
        });
        Object.defineProperty(g.document.documentElement, "clientHeight", {
          value: screenHeight,
          writable: false
        });
      });

      it("returns true when entire element is within the viewport", () => {
        expect(dom.isInViewport(inside.topLeft)).toBe(true);
        expect(dom.isInViewport(inside.topRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomRight)).toBe(true);
        expect(dom.isInViewport(inside.bottomLeft)).toBe(true);
      });

      it("returns false when entire element is outside of the viewport", () => {
        expect(dom.isInViewport(outside.topLeft)).toBe(false);
        expect(dom.isInViewport(outside.topRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomRight)).toBe(false);
        expect(dom.isInViewport(outside.bottomLeft)).toBe(false);
      });
    });
  });

  describe("isAlmostInViewport()", () => {
    const inside: any = {
      bottomLeft: mockElement(200, 200, screenHeight + 199, -399),
      bottomRight: mockElement(200, 200, screenHeight + 199, screenWidth + 199),
      topLeft: mockElement(200, 200, -399, -399),
      topRight: mockElement(200, 200, -399, screenWidth + 199)
    };

    const outside: any = {
      bottomLeft: mockElement(200, 200, screenHeight + 200, -400),
      bottomRight: mockElement(200, 200, screenHeight + 200, screenWidth + 200),
      topLeft: mockElement(200, 200, -400, -400),
      topRight: mockElement(200, 200, -400, screenWidth + 200)
    };

    it("returns false when an element isn't provided", () => {
      expect(dom.isAlmostInViewport()).toBe(false);
    });

    describe("on a browser that supports window.innerWidth and window.innerHeight", () => {
      beforeEach(() => {
        g.innerWidth = screenWidth;
        g.innerHeight = screenHeight;
      });

      it("returns true when element is within an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(inside.topLeft, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.topRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomLeft, 200)).toBe(true);
      });

      it("returns false when element is outside of an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(outside.topLeft, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.topRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomLeft, 200)).toBe(false);
      });
    });

    describe("on a browser that doesn't support window.innerWidth and window.innerHeight", () => {
      beforeEach(() => {
        g.innerWidth = undefined;
        g.innerHeight = undefined;

        Object.defineProperty(g.document.documentElement, "clientWidth", {
          value: screenWidth,
          writable: false
        });
        Object.defineProperty(g.document.documentElement, "clientHeight", {
          value: screenHeight,
          writable: false
        });
      });

      it("returns true when element is within an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(inside.topLeft, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.topRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomRight, 200)).toBe(true);
        expect(dom.isAlmostInViewport(inside.bottomLeft, 200)).toBe(true);
      });

      it("returns false when element is outside of an area 200px bigger than the viewport", () => {
        expect(dom.isAlmostInViewport(outside.topLeft, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.topRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomRight, 200)).toBe(false);
        expect(dom.isAlmostInViewport(outside.bottomLeft, 200)).toBe(false);
      });
    });
  });
});
