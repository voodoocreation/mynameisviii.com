import * as actions from "../../../actions/root.actions";
import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import Navigation from "./Navigation";

const component = new WrapperWithRedux(Navigation);

describe("[connected] <Navigation />", () => {
  describe("when interacting with the component", () => {
    const wrapper = component.mount();

    it("clicks the toggle button", () => {
      wrapper.find("button").simulate("click");
    });

    it("dispatches actions.toggleNavigation", () => {
      expect(
        component.reduxHistory.filter(actions.toggleNavigation.match)
      ).toHaveLength(1);
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
