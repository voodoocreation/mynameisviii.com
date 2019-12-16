import * as actions from "../../../actions/root.actions";
import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import OnlineStatusToast from "./OnlineStatusToast";

const component = new WrapperWithRedux(OnlineStatusToast);

describe("[connected] <OnlineStatusToast />", () => {
  jest.useFakeTimers();

  describe("when initially offline", () => {
    const wrapper = component
      .withReduxState({
        app: {
          isOnline: false
        }
      })
      .mount();

    it("renders the toast", () => {
      expect(wrapper.find(".Toast")).toHaveLength(1);
    });

    it("renders with YOU_ARE_OFFLINE", () => {
      expect(wrapper.find("#YOU_ARE_OFFLINE")).toHaveLength(1);
    });

    it("dispatches actions.setOnlineStatus(true)", () => {
      wrapper.store.dispatch(actions.setOnlineStatus(true));
    });

    it("renders with YOU_ARE_BACK_ONLINE", () => {
      expect(wrapper.update().find("#YOU_ARE_BACK_ONLINE")).toHaveLength(1);
    });

    it("waits for the toast to auto-dismiss", () => {
      jest.runTimersToTime(500);
    });

    it("dispatches actions.setOnlineStatus(true) again", () => {
      wrapper.store.dispatch(actions.setOnlineStatus(true));
    });

    it("doesn't re-render the toast", () => {
      expect(wrapper.render().find(".Toast")).toHaveLength(0);
    });
  });

  describe("when initially online", () => {
    const wrapper = component
      .withReduxState({
        app: {
          isOnline: true
        }
      })
      .mount();

    it("doesn't render anything", () => {
      expect(wrapper.find(".Toast")).toHaveLength(0);
    });
  });
});
