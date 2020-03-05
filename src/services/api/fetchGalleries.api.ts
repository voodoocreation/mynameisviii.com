import { API } from "../../constants/url.constants";
import {
  failure,
  gallery,
  IRawAppearance,
  IRawS3Response,
  s3Response,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchGalleries = (request: TRequest) => async (
  startAfter?: string
) => {
  try {
    const response: IRawS3Response<IRawAppearance> = await request(
      API.FETCH_GALLERIES,
      {
        params: { startAfter }
      }
    );

    return success(
      s3Response({
        ...response,
        items: response.items.map(gallery)
      })
    );
  } catch (error) {
    return failure(error);
  }
};
