import { mount } from "enzyme";
import * as React from "react";

import Portal from "./Portal";

jest.mock("react-dom", () => ({
  createPortal: (component: any) => component
}));

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    ...fromTestProps
  };

  return {
    actual: fn(
      <Portal {...props}>
        <div className="TestPortalComponent" />
      </Portal>
    ),
    props
  };
};

describe("[presentation] <Portal />", () => {
  beforeEach(() => {
    g.isServer = false;
  });

  it("renders correctly on the client", () => {
    const { actual } = setup(mount);

    expect(actual.render()).toMatchSnapshot();
  });

  it("renders correctly on the server", () => {
    g.isServer = true;
    const { actual } = setup(mount);

    expect(actual.render()).toMatchSnapshot();
  });

  it("mounts and unmounts without throwing any errors on the client", () => {
    let isPassing = true;

    try {
      const { actual } = setup(mount);
      actual.unmount();
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  it("mounts and unmounts without throwing any errors on the server", () => {
    let isPassing = true;
    g.isServer = true;

    try {
      const { actual } = setup(mount);
      actual.unmount();
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  it("appends portal container to document portal on mount and removes it on unmount", () => {
    const portal = document.createElement("div");
    portal.className = "Portal";
    document.body.appendChild(portal);

    const { actual, props } = setup(mount, { className: "TestPortal" });
    expect(portal.querySelectorAll(`.${props.className}`)).toHaveLength(1);

    actual.unmount();
    expect(portal.querySelectorAll(`.${props.className}`)).toHaveLength(0);
  });
});
