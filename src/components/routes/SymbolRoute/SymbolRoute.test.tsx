import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import SymbolRoute from "./SymbolRoute";

const component = new WrapperWithRedux(SymbolRoute);

describe("[routes] <SymbolRoute />", () => {
  it("renders correctly", () => {
    const wrapper = component.mount();

    expect(wrapper.render()).toMatchSnapshot();
  });
});
