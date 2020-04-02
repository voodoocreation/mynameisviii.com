import { API } from "../../constants/url.constants";
import {
  appearance,
  failure,
  IRawAppearance,
  success,
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchAppearanceBySlug = (request: TRequest) => async (
  slug: string
) => {
  try {
    const response: IRawAppearance = await request(
      `${API.FETCH_APPEARANCE}/${slug}`
    );

    return success(appearance(response));
  } catch (error) {
    return failure(error);
  }
};
