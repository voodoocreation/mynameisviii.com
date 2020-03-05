import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import NewVersionToast from "./NewVersionToast";

const component = new WrapperWithRedux(NewVersionToast);

describe("[connected] <NewVersionToast />", () => {
  describe("when there's no new version available", () => {
    const wrapper = component
      .withReduxState({
        app: {
          hasNewVersion: false
        }
      })
      .mount();

    it("doesn't render the toast", () => {
      expect(wrapper.render().html()).toBeNull();
    });
  });

  describe("when there's a new version available", () => {
    const wrapper = component
      .withReduxState({
        app: {
          hasNewVersion: true
        }
      })
      .mount();

    it("renders the toast", () => {
      expect(wrapper.find(".Toast")).toHaveLength(1);
    });

    describe("when clicking the refresh button", () => {
      jest.spyOn(window.location, "reload");

      it("clicks the button", () => {
        wrapper.find("Button.NewVersionToast--refreshButton").simulate("click");
      });

      it("triggers a hard refresh", () => {
        expect(window.location.reload).toHaveBeenCalledWith(true);
      });
    });
  });
});
