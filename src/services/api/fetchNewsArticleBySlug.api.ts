import transformNewsArticle from "../../transformers/transformNewsArticle";

export const fetchNewsArticleBySlug = (request: any) => async (
  slug: string
) => {
  try {
    const response = await request({ url: `/news/${slug}` });

    return {
      data: transformNewsArticle(response),
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};