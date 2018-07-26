import { mount, render } from "enzyme";
import * as React from "react";

import NavItem from "./NavItem";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    ...fromTestProps
  };

  return {
    actual: fn(<NavItem {...props}>Test nav item</NavItem>),
    props
  };
};

describe("[containers] <NavItem />", () => {
  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when isSelected=true", () => {
    const { actual } = setup(render, { isSelected: true });
    expect(actual).toMatchSnapshot();
  });

  it("triggers `onClick` prop when item is clicked on", () => {
    const { actual, props } = setup(mount, { onClick: jest.fn() });

    actual.simulate("click");
    expect(props.onClick).toHaveBeenCalled();
  });

  it("doesn't throw an error when `onClick` prop is undefined and item is clicked on", () => {
    let isPassing = true;
    const { actual } = setup(mount);

    try {
      actual.simulate("click");
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });
});
