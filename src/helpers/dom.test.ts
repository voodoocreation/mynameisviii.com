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
const html = document.documentElement;
const { body } = document;

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

        Object.defineProperty(html, "clientWidth", {
          value: screenWidth,
          writable: false
        });
        Object.defineProperty(html, "clientHeight", {
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

        Object.defineProperty(html, "clientWidth", {
          value: screenWidth,
          writable: false
        });
        Object.defineProperty(html, "clientHeight", {
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

  describe("lockScroll()", () => {
    beforeEach(() => {
      window.scrollState.count = 0;
      body.scrollTop = 200;
      body.style.paddingRight = "";
      html.className = "";
    });

    it("adds `isLocked` class to html node and sets body padding to compensate for scrollbar", () => {
      dom.lockScroll();

      expect(html.classList.contains("isLocked")).toBe(true);
      expect(body.style.paddingRight).not.toBe("");
      expect(window.scrollState.count).toBe(1);
      expect(window.scrollState.top).toBe(200);
    });

    it("does nothing when scrolling is already locked", () => {
      dom.lockScroll();
      dom.lockScroll();

      expect(html.classList.contains("isLocked")).toBe(true);
      expect(body.style.paddingRight).toBe("0px");
      expect(window.scrollState.count).toBe(2);
      expect(window.scrollState.top).toBe(200);
    });

    it("takes existing body padding into consideration when compensating for scrollbar", () => {
      body.style.paddingRight = "50px";

      dom.lockScroll();

      expect(body.style.paddingRight).toBe("50px");
    });

    it("refers to html node instead of body node when body isn't what's scrolling", () => {
      body.scrollTop = 0;
      html.scrollTop = 300;

      dom.lockScroll();

      expect(body.style.paddingRight).toBe("50px");
      expect(window.scrollState.top).toBe(300);
    });
  });

  describe("unlockScroll()", () => {
    beforeEach(() => {
      window.scrollState.count = 0;
      body.scrollTop = 200;
      body.style.paddingRight = "";
      html.className = "";
    });

    it("removes `isLocked` class from html node and resets body padding to initial value", () => {
      body.style.paddingRight = "50px";

      dom.lockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);
      expect(body.style.paddingRight).toBe("50px");
    });

    it("doesn't unlock scroll until it has been called the same number of times as lockScroll() has been called", () => {
      dom.lockScroll();
      dom.lockScroll();
      dom.lockScroll();

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(true);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);

      dom.unlockScroll();
      expect(html.classList.contains("isLocked")).toBe(false);
    });
  });
});
