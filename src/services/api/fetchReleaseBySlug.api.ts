import { API } from "../../constants/url.constants";
import {
  failure,
  IRawRelease,
  release,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchReleaseBySlug = (request: TRequest) => async (
  slug: string
) => {
  try {
    const response: IRawRelease = await request(`${API.FETCH_RELEASE}/${slug}`);

    return success(release(response));
  } catch (error) {
    return failure(error);
  }
};
