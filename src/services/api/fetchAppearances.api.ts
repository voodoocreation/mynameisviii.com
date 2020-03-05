import { API } from "../../constants/url.constants";
import {
  appearance,
  dynamoResponse,
  failure,
  IRawAppearance,
  IRawDynamoResponse,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchAppearances = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<
      IRawAppearance,
      "startingAt"
    > = await request(API.FETCH_APPEARANCES, {
      params: { exclusiveStartKey, limit }
    });

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(appearance)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
