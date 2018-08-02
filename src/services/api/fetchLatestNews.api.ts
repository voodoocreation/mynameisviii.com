import transformNewsArticle from "../../transformers/transformNewsArticle";

const transformLatestNews = (articles: any) =>
  articles.map(transformNewsArticle);

export const fetchLatestNews = (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response = await request({
      params: { exclusiveStartKey, limit },
      url: `/news/find`
    });

    return {
      data: {
        ...response,
        items: transformLatestNews(response.items)
      },
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};
