import dayjs from "dayjs";

import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import DateTime from "./DateTime";

const component = new WrapperWithIntl(DateTime).withDefaultProps({
  className: "TestDateTime",
  value: dayjs()
    .add(9, "month")
    .add(3, "hour")
    .toDate()
});

describe("[presentation] <DateTime />", () => {
  describe("when isRelative is true and isDateOnly is true", () => {
    const wrapper = component
      .withProps({
        isDateOnly: true,
        isRelative: true
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-01");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Monday, 1 October 2018");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("in 9 months");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and isDateOnly is false", () => {
    const wrapper = component
      .withProps({
        isDateOnly: false,
        isRelative: false
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-01T03:00:00");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Monday, 1 October 2018, 3:00 am");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("Monday, 1 October 2018, 3:00 am");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and isDateOnly is true", () => {
    const wrapper = component
      .withProps({
        isDateOnly: true,
        isRelative: false
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-01");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("Monday, 1 October 2018");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("Monday, 1 October 2018");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("when isRelative is false and only time options are defined", () => {
    const wrapper = component
      .withProps({
        isRelative: false,
        options: {
          hour: "numeric",
          hour12: true,
          minute: "numeric"
        }
      })
      .render();

    it("renders with the correct datetime attribute", () => {
      expect(wrapper.attr("datetime")).toBe("2018-10-01T03:00:00");
    });

    it("renders with the correct title attribute", () => {
      expect(wrapper.attr("title")).toBe("3:00 am");
    });

    it("renders with the correct text content", () => {
      expect(wrapper.text()).toBe("3:00 am");
    });

    it("matches snapshot", () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
