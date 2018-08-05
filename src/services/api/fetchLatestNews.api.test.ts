import news from "../../../server/mocks/news.json";
import createMockHttpClient from "../../helpers/createMockHttpClient";
import { tryParseJson } from "../../transformers/transformData";
import { createPortsWith } from "../configureApi";
import { fetchLatestNews } from "./fetchLatestNews.api";

describe("[api] fetchLatestNews()", () => {
  it("handles successful request correctly", async () => {
    const client = createMockHttpClient(resolve => {
      resolve({
        data: news
      });
    });
    const fetch = fetchLatestNews(createPortsWith({}, client));
    const response = await fetch(1, "test");

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/news/find");
    expect(client.mock.calls[0][0].params).toEqual({
      exclusiveStartKey: "test",
      limit: 1
    });
    expect(response.ok).toBe(true);
    expect(response.data.items).toHaveLength(5);
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
    const fetch = fetchLatestNews(createPortsWith({}, client));
    const response = await fetch();

    expect(client).toHaveBeenCalled();
    expect(client.mock.calls[0][0].url).toBe("/news/find");
    expect(response.ok).toBe(false);
    expect(tryParseJson(response.message)).toEqual({
      message: "Server error",
      status: 500
    });
  });
});
