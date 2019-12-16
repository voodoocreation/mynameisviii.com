import { filterCalls } from "jest-mocks";
import * as React from "react";

import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import Modal from "./Modal";

const component = new WrapperWithIntl(Modal)
  .withDefaultProps({
    className: "TestModal",
    hasFocusRestriction: true,
    isOpen: true,
    onClose: jest.fn(),
    usePortal: false
  })
  .withDefaultChildren(
    <div className="Modal--testContent">
      <input id="Modal--input" />
    </div>
  );

describe("[presentation] <Modal />", () => {
  jest.spyOn(window, "addEventListener");
  jest.spyOn(window, "removeEventListener");

  it("doesn't render anything when isOpen is false", () => {
    const wrapper = component.withProps({ isOpen: false }).mount();

    expect(wrapper.render().html()).toBeNull();
  });

  describe("when toggling the isOpen prop", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it("mounts the component", () => {
      wrapper = component.mount();
    });

    it("renders the modal", () => {
      expect(wrapper.find(".Modal")).toHaveLength(1);
    });

    it("matches snapshot when open", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    it("renders the children in the body element", () => {
      expect(wrapper.find(".Modal--body .Modal--testContent")).toHaveLength(1);
    });

    it("sets the isOpen prop to false", () => {
      wrapper.setProps({ isOpen: false });
    });

    it("doesn't render anything", () => {
      expect(wrapper.render().html()).toBeNull();
    });

    it("sets the isOpen prop to true again", () => {
      wrapper.setProps({ isOpen: true });
    });

    it("renders the modal", () => {
      expect(wrapper.find(".Modal")).toHaveLength(1);
    });

    it("sets the isOpen prop to false", () => {
      wrapper.setProps({ isOpen: false });
    });
  });

  describe("when interacting with the close button", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it("mounts the component", () => {
      wrapper = component.mount();
    });

    it("clicks the close button", () => {
      wrapper.find("Button.Modal--closeButton").simulate("click");
    });

    it("calls the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when interacting with the overlay", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it("mounts the component", () => {
      wrapper = component.mount();
    });

    it("clicks the overlay", () => {
      wrapper.find(".Modal--overlay").simulate("click");
    });

    it("calls the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("sets the hasOverlayClick prop to false", () => {
      wrapper.setProps({ hasOverlayClick: false });
    });

    it("clicks the overlay", () => {
      wrapper.find(".Modal--overlay").simulate("click");
    });

    it("doesn't call the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when interacting with the keyboard", () => {
    let wrapper: ReturnType<typeof component.mount>;

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("mounts the component", () => {
      wrapper = component
        .withProps({
          onKeyDown: jest.fn()
        })
        .mount();
    });

    it("binds keydown event handler", () => {
      expect(
        filterCalls(window.addEventListener as jest.Mock, "keydown")
      ).toHaveLength(1);
    });

    it("presses the Escape key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("calls the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls the onKeyDown prop", () => {
      expect(component.props.onKeyDown).toHaveBeenCalledTimes(1);
    });

    it("presses a key other than Escape", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    it("doesn't call the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls the onKeyDown prop", () => {
      expect(component.props.onKeyDown).toHaveBeenCalledTimes(2);
    });

    it("sets the onKeyDown prop to be undefined", () => {
      wrapper.setProps({ onKeyDown: undefined });
    });

    it("presses the Escape key", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("calls the onClose prop", () => {
      expect(component.props.onClose).toHaveBeenCalledTimes(2);
    });

    it("sets the isOpen prop to false", () => {
      wrapper.setProps({ isOpen: false });
    });

    it("unbinds keydown event handler", () => {
      expect(
        filterCalls(window.removeEventListener as jest.Mock, "keydown")
      ).toHaveLength(1);
    });

    it("sets the isOpen prop to true", () => {
      wrapper.setProps({ isOpen: true });
    });

    it("binds keydown event handler", () => {
      expect(
        filterCalls(window.addEventListener as jest.Mock, "keydown")
      ).toHaveLength(2);
    });

    it("unmounts component", () => {
      wrapper.unmount();
    });

    it("unbinds keydown event handler", () => {
      expect(
        filterCalls(window.removeEventListener as jest.Mock, "keydown")
      ).toHaveLength(2);
    });
  });

  describe("Focus management", () => {
    describe("when binding the focus event handler", () => {
      let wrapper: ReturnType<typeof component.mount>;

      beforeAll(() => {
        jest.clearAllMocks();
      });

      afterAll(() => {
        wrapper.unmount();
      });

      it("mounts the component", () => {
        wrapper = component
          .withProps({
            hasFocusRestriction: true
          })
          .mount();
      });

      it("binds focus event handler", () => {
        expect(
          filterCalls(window.addEventListener as jest.Mock, "focus")
        ).toHaveLength(1);
      });

      it("sets the isOpen prop to false", () => {
        wrapper.setProps({ isOpen: false });
      });

      it("unbinds focus event handler", () => {
        expect(
          filterCalls(window.removeEventListener as jest.Mock, "focus")
        ).toHaveLength(1);
      });

      it("sets the isOpen prop to true", () => {
        wrapper.setProps({ isOpen: true });
      });

      it("binds focus event handler", () => {
        expect(
          filterCalls(window.addEventListener as jest.Mock, "focus")
        ).toHaveLength(2);
      });

      it("sets the hasFocusRestriction prop to false", () => {
        wrapper.setProps({ hasFocusRestriction: false });
      });

      it("unbinds focus event handler", () => {
        expect(
          filterCalls(window.removeEventListener as jest.Mock, "focus")
        ).toHaveLength(2);
      });

      it("sets the isOpen prop to false", () => {
        wrapper.setProps({ isOpen: false });
      });

      it("doesn't unbind the focus event handler", () => {
        expect(
          filterCalls(window.removeEventListener as jest.Mock, "focus")
        ).toHaveLength(2);
      });

      it("sets the isOpen prop to true", () => {
        wrapper.setProps({ isOpen: true });
      });

      it("doesn't bind the focus event handler", () => {
        expect(
          filterCalls(window.removeEventListener as jest.Mock, "focus")
        ).toHaveLength(2);
      });

      it("sets the hasFocusRestriction prop to true", () => {
        wrapper.setProps({ hasFocusRestriction: true });
      });

      it("binds focus event handler", () => {
        expect(
          filterCalls(window.addEventListener as jest.Mock, "focus")
        ).toHaveLength(3);
      });
    });

    describe("when dispatching focus events", () => {
      const stopPropagationMock = jest.fn();

      const bodyEvent = new FocusEvent("focus");
      Object.defineProperties(bodyEvent, {
        stopPropagation: { value: stopPropagationMock },
        target: { value: document.body }
      });

      const inputNode = document.createElement("input");
      document.body.appendChild(inputNode);

      const outsideInputEvent = new FocusEvent("focus");
      Object.defineProperties(outsideInputEvent, {
        stopPropagation: { value: stopPropagationMock },
        target: { value: inputNode }
      });

      describe("when usePortal is false", () => {
        let wrapper: ReturnType<typeof component.mount>;

        beforeAll(() => {
          jest.clearAllMocks();
        });

        afterAll(() => {
          wrapper.unmount();
        });

        it("mounts the component", () => {
          wrapper = component.mount();
        });

        it("dispatches a focus event from the body element", () => {
          window.dispatchEvent(bodyEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(1);
        });

        it("dispatches a focus event from an input element outside the modal", () => {
          window.dispatchEvent(outsideInputEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("dispatches a focus event from an input element within the modal", () => {
          const modalInput = wrapper.find("#Modal--input").instance();
          const event = new FocusEvent("focus");
          Object.defineProperties(event, {
            stopPropagation: { value: stopPropagationMock },
            target: { value: modalInput }
          });
          window.dispatchEvent(event);
        });

        it("doesn't prevent the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("clears stopPropagationMock", () => {
          stopPropagationMock.mockClear();
        });
      });

      describe("when usePortal is true", () => {
        let wrapper: ReturnType<typeof component.mount>;

        beforeAll(() => {
          jest.clearAllMocks();
        });

        afterAll(() => {
          wrapper.unmount();
        });

        it("mounts the component", () => {
          wrapper = component
            .withProps({
              usePortal: true
            })
            .mount();
        });

        it("dispatches a focus event from the body element", () => {
          window.dispatchEvent(bodyEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(1);
        });

        it("dispatches a focus event from an input element outside the modal", () => {
          window.dispatchEvent(outsideInputEvent);
        });

        it("prevents the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("dispatches a focus event from an input element within the modal", () => {
          const modalInput = wrapper.find("#Modal--input").instance();
          const event = new FocusEvent("focus");
          Object.defineProperties(event, {
            stopPropagation: { value: stopPropagationMock },
            target: { value: modalInput }
          });
          window.dispatchEvent(event);
        });

        it("doesn't prevent the focus event from proceeding", () => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(2);
        });

        it("clears stopPropagationMock", () => {
          stopPropagationMock.mockClear();
        });
      });
    });
  });
});
