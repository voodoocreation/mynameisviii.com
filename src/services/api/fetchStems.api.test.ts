import stems from "../../../server/mocks/stems.json";
import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchStems } from "./fetchStems.api";

describe("[api] fetchStems()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: stems
      });
    });
    const fetch = fetchStems(createPortsWith({}, client));
    const response = await fetch(1, "test");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/stems/find");
    expect(client.mock.calls[0][0].params).toEqual({
      exclusiveStartKey: "test",
      limit: 1
    });
    expect(response.ok).toBe(true);
    expect(response.data.items).toHaveLength(7);
  });

  it("handles request failure correctly", async () => {
    const client = createMockHttpClient((_, reject) => {
      reject({
        response: {
          data: { message: "Server error" },
          status: 500
        }
      });
    });
    const fetch = fetchStems(createPortsWith({}, client));
    const response = await fetch();

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/stems/find");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Server error",
      status: 500
    });
  });
});
