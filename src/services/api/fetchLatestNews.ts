import transformNewsArticle from "../../domain/transformNewsArticle";

export const transformLatestNews = (articles: any) =>
  articles.map(transformNewsArticle);

export default (internet: any) => {
  return async (limit?: number, exclusiveStartKey?: string) => {
    try {
      const res = await internet({
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
        message: err.message || err.toString(),
        ok: false
      };
    }
  };
};
