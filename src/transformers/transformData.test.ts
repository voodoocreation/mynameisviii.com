import * as data from "./transformData";

describe("[transformers] data", () => {
  const valid = [{ id: "test-1" }, { id: "test-2" }, { id: "test-3" }];
  const invalid = [{ id: "test-1" }, { key: "test-2" }, { id: "test-3" }];

  describe("arrayToAssoc", () => {
    it("works correctly for a valid array", () => {
      let isPassing = true;
      let transformed = {};
      try {
        transformed = data.arrayToAssoc(valid, "id");
      } catch (error) {
        isPassing = false;
      }

      expect(Object.keys(transformed)).toEqual(["test-1", "test-2", "test-3"]);
      expect(isPassing).toBe(true);
    });

    it("excludes invalid items when set to fail silently", () => {
      let isPassing = true;
      let transformed = {};
      try {
        transformed = data.arrayToAssoc(invalid, "id");
      } catch (error) {
        isPassing = false;
      }

      expect(Object.keys(transformed)).toEqual(["test-1", "test-3"]);
      expect(isPassing).toBe(true);
    });

    it("throws an error for an invalid array", () => {
      let isPassing = true;
      let transformed = {};
      try {
        transformed = data.arrayToAssoc(invalid, "id", false);
      } catch (error) {
        isPassing = false;
      }

      expect(Object.keys(transformed)).toEqual([]);
      expect(isPassing).toBe(false);
    });
  });
});
