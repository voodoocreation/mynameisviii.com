import getScrollbarWidth from "scrollbar-size";

export const isInViewport = (element?: HTMLElement | null) => {
  if (!element) {
    return false;
  }

  const bounds = element.getBoundingClientRect();
  const viewport = {
    height: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth
  };

  return (
    bounds.top >= 0 &&
    bounds.right <= viewport.width &&
    bounds.bottom <= viewport.height &&
    bounds.left >= 0
  );
};

export const isAlmostInViewport = (
  element?: HTMLElement | null,
  offset = 0
) => {
  if (!element) {
    return false;
  }

  const bounds = element.getBoundingClientRect();
  const viewport = {
    height: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth
  };

  return (
    viewport.height - bounds.top > -offset &&
    bounds.right > -offset &&
    bounds.bottom > -offset &&
    viewport.width - bounds.left > -offset
  );
};

const scrollState = {
  count: 0,
  left: 0,
  top: 0
};

export const lockScroll = () => {
  const { body } = document;
  const html = document.documentElement;

  scrollState.count += 1;

  if (!html.classList.contains("isLocked")) {
    const existingPadding = parseInt(
      getComputedStyle(body, null).getPropertyValue("padding-right"),
      10
    );
    const scrollbarWidth = getScrollbarWidth();
    const newPadding =
      isNaN(existingPadding) || !isFinite(existingPadding)
        ? scrollbarWidth
        : scrollbarWidth + existingPadding;

    const scrollElement =
      body.scrollTop > 0 || html.scrollTop === 0 ? body : html;

    scrollState.top = scrollElement.scrollTop;
    scrollState.left = scrollElement.scrollLeft;

    html.classList.add("isLocked");
    body.style.paddingRight = `${newPadding}px`;
  }
};

export const unlockScroll = () => {
  const { body } = document;
  const html = document.documentElement;

  if (scrollState.count <= 1 && html.classList.contains("isLocked")) {
    body.style.paddingRight = "";
    html.classList.remove("isLocked");
    window.scrollTo(scrollState.left, scrollState.top);
  }

  if (scrollState.count > 0) {
    scrollState.count -= 1;
  }
};
