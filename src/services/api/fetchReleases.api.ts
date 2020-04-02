import { API } from "../../constants/url.constants";
import {
  dynamoResponse,
  failure,
  IRawDynamoResponse,
  IRawRelease,
  release,
  success,
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchReleases = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<
      IRawRelease,
      "releasedOn"
    > = await request(API.FETCH_RELEASES, {
      params: { exclusiveStartKey, limit },
    });

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(release),
      })
    );
  } catch (error) {
    return failure(error);
  }
};
