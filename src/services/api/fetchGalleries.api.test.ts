import galleries from "../../../server/mocks/galleries.json";
import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchGalleries } from "./fetchGalleries.api";

describe("[api] fetchGalleries()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: galleries
      });
    });
    const fetch = fetchGalleries(createPortsWith({}, client));
    const response = await fetch("test");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/galleries/find");
    expect(client.mock.calls[0][0].params).toEqual({
      startAfter: "test"
    });
    expect(response.ok).toBe(true);
    expect(response.data.items).toHaveLength(galleries.Items.length);
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
    const fetch = fetchGalleries(createPortsWith({}, client));
    const response = await fetch();

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/galleries/find");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Server error",
      status: 500
    });
  });
});
