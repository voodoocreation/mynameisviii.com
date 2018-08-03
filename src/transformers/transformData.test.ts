import * as data from "./transformData";

const nodeEnv = process.env.NODE_ENV;

describe("[transformers] Data", () => {
  describe("arrayToAssoc()", () => {
    const valid = [{ id: "test-1" }, { id: "test-2" }, { id: "test-3" }];
    const invalid = [{ id: "test-1" }, { key: "test-2" }, { id: "test-3" }];

    it("transforms correctly for a valid array", () => {
      let isPassing = true;
      let transformed = {};

      try {
        transformed = data.arrayToAssoc(valid, "id");
      } catch (error) {
        isPassing = false;
      }

      expect(transformed).toEqual({
        "test-1": valid[0],
        "test-2": valid[1],
        "test-3": valid[2]
      });
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

      expect(transformed).toEqual({
        "test-1": valid[0],
        "test-3": valid[2]
      });
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

      expect(transformed).toEqual({});
      expect(isPassing).toBe(false);
    });
  });

  describe("assocToArray()", () => {
    it("transforms correctly for a valid object", () => {
      expect(
        data.assocToArray({
          "test-1": { id: "test-1" },
          "test-2": { id: "test-2" },
          "test-3": { id: "test-3" }
        })
      ).toEqual([{ id: "test-1" }, { id: "test-2" }, { id: "test-3" }]);
    });
  });

  describe("tryParseJson()", () => {
    const valid = `{"test-1": ["1","2","3"]}`;
    const invalid = `{"test-1": ["1","2","3"]}}`;
    const expected = { "test-1": ["1", "2", "3"] };

    it("parses a valid JSON string", () => {
      expect(data.tryParseJson(valid)).toEqual(expected);
    });

    it("parses an Error with valid JSON string as its message", () => {
      expect(data.tryParseJson(new Error(valid))).toEqual(expected);
    });

    it("parses an object with `toString` method", () => {
      expect(data.tryParseJson({ toString: () => valid })).toEqual(expected);
    });

    it("fails silently and returns the input for an invalid JSON string", () => {
      expect(data.tryParseJson(invalid)).toEqual(invalid);
    });
  });

  describe("lengthToDuration()", () => {
    afterEach(() => {
      process.env.NODE_ENV = nodeEnv;
    });

    it("transforms correctly for a string with seconds", () => {
      expect(data.lengthToDuration("34")).toEqual("PT34S");
    });

    it("transforms correctly for a string with minutes and seconds", () => {
      expect(data.lengthToDuration("5:04")).toEqual("PT5M4S");
    });

    it("transforms correctly for a string with hours, minutes and seconds", () => {
      expect(data.lengthToDuration("06:05:04")).toEqual("PT6H5M4S");
    });

    it("throws an error for an invalid string", () => {
      let isPassing = true;

      try {
        data.lengthToDuration("34:52:32:50");
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(false);
    });
  });

  describe("absUrl()", () => {
    describe("when NODE_ENV=development", () => {
      beforeEach(() => {
        process.env.NODE_ENV = "development";
        process.env.PORT = "5000";
      });

      it("prefixes with http://localhost:{process.env.PORT}", () => {
        expect(data.absUrl("/news/article-slug")).toEqual(
          "http://localhost:5000/news/article-slug"
        );
      });
    });

    describe("when NODE_ENV=production", () => {
      beforeEach(() => {
        process.env.NODE_ENV = "production";
      });

      it("prefixes with http://{process.env.DOMAIN} when it's defined", () => {
        process.env.DOMAIN = "mynameisviii.com";

        expect(data.absUrl("/news/article-slug")).toEqual(
          "https://mynameisviii.com/news/article-slug"
        );
      });

      it("prefixes with http://{window.location.host} when process.env.DOMAIN is undefined", () => {
        process.env.DOMAIN = undefined;

        expect(data.absUrl("/news/article-slug")).toEqual(
          "https://localhost/news/article-slug"
        );
      });
    });
  });

  describe("extractDomain()", () => {
    it("extracts domain correctly", () => {
      expect(data.extractDomain("https://mynameisviii.com/news")).toEqual(
        "mynameisviii.com"
      );
    });
  });
});
