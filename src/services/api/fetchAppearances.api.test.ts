import { mockWithRejectedPromise, mockWithResolvedPromise } from "jest-mocks";

import { BOOLEAN } from "../../constants/api.constants";
import {
  appearance,
  dynamoResponse,
  failure,
  success
} from "../../models/root.models";
import { fetchAppearances } from "./fetchAppearances.api";

describe("[api] fetchAppearances", () => {
  const params = {
    exclusiveStartKey: "test",
    limit: 1
  };

  describe("when the request succeeds", () => {
    const data = {
      items: [{ isActive: BOOLEAN.TRUE, slug: "test-1" }],
      lastEvaluatedKey: {
        isActive: BOOLEAN.TRUE,
        slug: "test-0",
        startingAt: "2019-01-01T00:00:00"
      }
    };
    const request = mockWithResolvedPromise(data);
    const method = fetchAppearances(request);

    it("returns a success response with the model-parsed data", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        success(
          dynamoResponse({
            items: data.items.map(appearance),
            lastEvaluatedKey: data.lastEvaluatedKey
          })
        )
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/appearances/find"
      });
    });
  });

  describe("when the request fails", () => {
    const request = mockWithRejectedPromise("Fetch failed");
    const method = fetchAppearances(request);

    it("returns a failure response with the expected error", async () => {
      expect(await method(params.limit, params.exclusiveStartKey)).toEqual(
        failure("Fetch failed")
      );
    });

    it("makes the request correctly", () => {
      expect(request).toHaveBeenCalledWith({
        params,
        url: "/appearances/find"
      });
    });
  });
});
