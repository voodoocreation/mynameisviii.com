import { mockWithRejectedPromise, mockWithResolvedPromise } from "jest-mocks";

import { BOOLEAN } from "../../constants/api.constants";
import { API } from "../../constants/url.constants";
import {
  dynamoResponse,
  failure,
  resource,
  success
} from "../../models/root.models";
import { fetchResources } from "./fetchResources.api";

describe("[api] fetchResources", () => {
  const params = {
    exclusiveStartKey: "test",
    limit: 1
  };

  describe("when the request succeeds", () => {
    const data = {
      items: [{ isActive: BOOLEAN.TRUE, slug: "test-1" }],
      lastEvaluatedKey: {
        createdAt: "2019-01-01T00:00:00",
        isActive: BOOLEAN.TRUE,
        slug: "test-0"
      }
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchResources(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        success(
          dynamoResponse({
            items: data.items.map(resource),
            lastEvaluatedKey: data.lastEvaluatedKey
          })
        )
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith(API.FETCH_RESOURCES, {
        params
      });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchResources(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        failure("Fetch failed")
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith(API.FETCH_RESOURCES, {
        params
      });
    });
  });
});
