import releases from "../../../server/mocks/releases.json";
import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchReleases } from "./fetchReleases.api";

describe("[api] fetchReleases()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: releases
      });
    });
    const fetch = fetchReleases(createPortsWith({}, client));
    const response = await fetch(1, "test");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/releases/find");
    expect(client.mock.calls[0][0].params).toEqual({
      exclusiveStartKey: "test",
      limit: 1
    });
    expect(response.ok).toBe(true);
    expect(response.data.items).toHaveLength(4);
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
    const fetch = fetchReleases(createPortsWith({}, client));
    const response = await fetch();

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/releases/find");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Server error",
      status: 500
    });
  });
});
