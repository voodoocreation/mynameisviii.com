import transformNewsArticle from "../../transformers/transformNewsArticle";

export const transformLatestNews = (articles: any) =>
  articles.map(transformNewsArticle);

export default (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const res = await request({
      params: { exclusiveStartKey, limit },
      url: `/news/find`
    });

    return {
      data: {
        ...res,
        items: transformLatestNews(res.items)
      },
      ok: true
    };
  } catch (err) {
    return {
      message: err.message,
      ok: false
    };
  }
};
