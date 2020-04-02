import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import Toast from "./Toast";

const component = new WrapperWithIntl(Toast);

describe("[presentation] <Toast />", () => {
  jest.useFakeTimers();

  describe("when hasAutoDismiss prop is true", () => {
    const onClose = jest.fn();
    const wrapper = component
      .withProps({
        hasAutoDismiss: true,
        onClose,
      })
      .mount();

    it("renders correctly when visible", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("waits for the auto dismiss delay length", () => {
      jest.runTimersToTime(component.props.autoDismissDelay!);
    });

    it("doesn't unrender yet", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("calls the onClose prop", () => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("doesn't render anything after the delay has passed", () => {
      wrapper.update();

      expect(wrapper.html()).toBe("");
    });
  });

  describe("when hasAutoDismiss prop is false", () => {
    const onClose = jest.fn();
    const wrapper = component
      .withProps({
        hasAutoDismiss: false,
        onClose,
      })
      .mount();

    it("renders correctly when visible", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("clicks the close button twice in quick succession", () => {
      wrapper.find("Button.Toast--closeButton").simulate("click");
      wrapper.find("Button.Toast--closeButton").simulate("click");
    });

    it("doesn't unrender yet", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("calls the onClose prop", () => {
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it("doesn't render anything after the delay has passed", () => {
      jest.runTimersToTime(200);
      wrapper.update();

      expect(wrapper.html()).toBe("");
    });
  });

  describe("when passing isVisible prop", () => {
    const wrapper = component
      .withProps({
        hasAutoDismiss: true,
        isVisible: true,
      })
      .mount();

    it("renders the toast when visible", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("sets the isVisible prop to false", () => {
      wrapper.setProps({ isVisible: false });
    });

    it("doesn't render anything", () => {
      jest.runTimersToTime(200);
      wrapper.update();

      expect(wrapper.html()).toBe("");
    });

    it("passes isVisible prop as true again", () => {
      wrapper.setProps({ isVisible: true });
    });

    it("renders the toast again", () => {
      jest.runTimersToTime(200);
      wrapper.update();

      expect(wrapper.html()).not.toBe("");
    });

    it("waits for the auto dismiss delay length", () => {
      jest.runTimersToTime(component.props.autoDismissDelay!);
    });

    it("doesn't unrender yet", () => {
      expect(wrapper.html()).not.toBe("");
    });

    it("doesn't render anything after the delay has passed again", () => {
      jest.runTimersToTime(200);
      wrapper.update();

      expect(wrapper.html()).toBe("");
    });

    it("passes isVisible prop as false after it's already hidden", () => {
      wrapper.setProps({ isVisible: false });
    });

    it("still doesn't render anything", () => {
      jest.runTimersToTime(200);
      wrapper.update();

      expect(wrapper.html()).toBe("");
    });
  });
});
