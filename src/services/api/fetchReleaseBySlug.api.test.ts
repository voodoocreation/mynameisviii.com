import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchReleaseBySlug } from "./fetchReleaseBySlug.api";

describe("[api] fetchReleaseBySlug()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: { IsActive: "y", Title: "test" }
      });
    });
    const fetch = fetchReleaseBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/releases/test-1");
    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ isActive: true, title: "test" });
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
    const fetch = fetchReleaseBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/releases/test-1");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Not found",
      status: 404
    });
  });
});
