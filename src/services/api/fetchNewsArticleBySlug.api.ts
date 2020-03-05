import { API } from "../../constants/url.constants";
import {
  failure,
  IRawNewsArticle,
  newsArticle,
  success
} from "../../models/root.models";
import { TRequest } from "../configureHttpClient";

export const fetchNewsArticleBySlug = (request: TRequest) => async (
  slug: string
) => {
  try {
    const response: IRawNewsArticle = await request(
      `${API.FETCH_NEWS_ARTICLE}/${slug}`
    );

    return success(newsArticle(response));
  } catch (error) {
    return failure(error);
  }
};
