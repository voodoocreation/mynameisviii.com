import { API } from "../../constants/url.constants";
import {
  dynamoResponse,
  failure,
  IRawDynamoResponse,
  IRawStem,
  stem,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchStems = (request: TRequest) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response: IRawDynamoResponse<IRawStem, "createdAt"> = await request(
      API.FETCH_STEMS,
      {
        params: { exclusiveStartKey, limit }
      }
    );

    return success(
      dynamoResponse({
        ...response,
        items: response.items.map(stem)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
