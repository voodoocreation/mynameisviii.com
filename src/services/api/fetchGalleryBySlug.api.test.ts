import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchGalleryBySlug } from "./fetchGalleryBySlug.api";

describe("[api] fetchGalleryBySlug()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: { Title: "test" }
      });
    });
    const fetch = fetchGalleryBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/galleries/test-1");
    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ title: "test" });
  });

  it("handles request failure correctly", async () => {
    const client = createMockHttpClient((_, reject) => {
      reject({
        response: {
          data: { message: "Not found" },
          status: 404
        }
      });
    });
    const fetch = fetchGalleryBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/galleries/test-1");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Not found",
      status: 404
    });
  });
});
