import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import fetchAppearanceBySlug from "./fetchAppearanceBySlug";

describe("[api] fetchAppearanceBySlug()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: { IsActive: "y", Name: "test" }
      });
    });
    const fetch = fetchAppearanceBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/appearances/test-1");
    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ isActive: true, name: "test" });
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
    const fetch = fetchAppearanceBySlug(createPortsWith({}, client));
    const response = await fetch("test-1");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/appearances/test-1");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Not found",
      status: 404
    });
  });
});
