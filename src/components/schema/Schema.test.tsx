import { Wrapper } from "react-test-wrapper";

import Schema from "./Schema";

const component = new Wrapper(Schema);

describe("[schema] <Schema />", () => {
  it("renders correctly", () => {
    const wrapper = component.render();
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly when isPretty=true", () => {
    const wrapper = component
      .withProps({
        isPretty: true,
      })
      .render();

    expect(wrapper).toMatchSnapshot();
  });
});
