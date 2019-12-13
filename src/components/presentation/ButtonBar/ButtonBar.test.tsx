import * as React from "react";

import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import ButtonBar from "./ButtonBar";

const component = new WrapperWithIntl(ButtonBar);

describe("[presentation] <ButtonBar />", () => {
  it("doesn't render anything when there are no children", () => {
    const wrapper = component.render();

    expect(wrapper.html()).toBeNull();
  });

  describe("when there are children", () => {
    const wrapper = component.withChildren(<div className="Child" />).render();

    it("renders the children", () => {
      expect(wrapper.find(".Child")).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
