import axios from "axios";
import { camelizeKeys } from "humps";

import fetchAppearanceBySlug from "./api/fetchAppearanceBySlug";
import fetchAppearances from "./api/fetchAppearances";
import fetchLatestNews from "./api/fetchLatestNews";
import fetchNewsArticleBySlug from "./api/fetchNewsArticleBySlug";
import fetchReleaseBySlug from "./api/fetchReleaseBySlug";
import fetchReleases from "./api/fetchReleases";

export const createApiWith = (ports: any) => ({
  fetchAppearanceBySlug: fetchAppearanceBySlug(ports),
  fetchAppearances: fetchAppearances(ports),
  fetchLatestNews: fetchLatestNews(ports),
  fetchNewsArticleBySlug: fetchNewsArticleBySlug(ports),
  fetchReleaseBySlug: fetchReleaseBySlug(ports),
  fetchReleases: fetchReleases(ports)
});

export const createPortsWith = (
  config: any,
  client: (config: any) => Promise<any> = axios
) => ({
  body,
  method = "GET",
  params,
  url
}: {
  body?: string;
  method?: string;
  params?: {};
  url: string;
}) =>
  client({
    baseURL: config.apiUrl,
    data: body,
    method,
    params,
    url
  })
    .then(response => camelizeKeys(response.data))
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          JSON.stringify(
            camelizeKeys({
              ...error.response.data,
              status: error.response.status
            })
          )
        );
      } else if (error.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser
        throw new Error(error.request.statusText);
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message);
      }
    });
