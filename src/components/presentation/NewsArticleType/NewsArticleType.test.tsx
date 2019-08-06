import { TYPE } from "../../../constants/news.constants";
import * as messages from "../../../locales/en-NZ";
import ComponentTester from "../../../utilities/ComponentTester";
import NewsArticleType from "./NewsArticleType";

const component = new ComponentTester(NewsArticleType);

describe("[presentation] <NewsArticleType />", () => {
  describe("when hasLabel is false", () => {
    const { wrapper } = component.withProps({ hasLabel: false }).render();

    it("uses the label for the title attribute", () => {
      expect(wrapper.attr("title")).toBe(messages.NEWS);
    });

    it("doesn't render the label", () => {
      expect(wrapper.find(".NewsArticleType--label")).toHaveLength(0);
    });
  });

  describe("when hasLabel is true", () => {
    const { wrapper } = component.withProps({ hasLabel: true }).render();

    it("has an undefined title attribute", () => {
      expect(wrapper.attr("title")).toBeUndefined();
    });

    it("renders the label", () => {
      expect(wrapper.find(".NewsArticleType--label")).toHaveLength(1);
    });
  });

  describe("when the type is NEWS", () => {
    const { wrapper } = component.withProps({ value: TYPE.NEWS }).mount();

    it("renders the correct icon", () => {
      expect(wrapper.find("MdNewReleases")).toHaveLength(1);
    });

    it("renders the correct label", () => {
      expect(wrapper.find(".NewsArticleType--label").text()).toBe(
        messages.NEWS
      );
    });
  });

  describe("when the type is RELEASE", () => {
    const { wrapper } = component.withProps({ value: TYPE.RELEASE }).mount();

    it("renders the correct icon", () => {
      expect(wrapper.find("MdAlbum")).toHaveLength(1);
    });

    it("renders the correct label", () => {
      expect(wrapper.find(".NewsArticleType--label").text()).toBe(
        messages.RELEASE
      );
    });
  });

  describe("when the type is APPEARANCE", () => {
    const { wrapper } = component.withProps({ value: TYPE.APPEARANCE }).mount();

    it("renders the correct icon", () => {
      expect(wrapper.find("MdEvent")).toHaveLength(1);
    });

    it("renders the correct label", () => {
      expect(wrapper.find(".NewsArticleType--label").text()).toBe(
        messages.APPEARANCE
      );
    });
  });
});
