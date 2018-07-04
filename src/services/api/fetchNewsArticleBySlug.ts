import transformNewsArticle from "../../transformers/transformNewsArticle";

export default (request: any) => async (slug: string) => {
  try {
    const res = await request({ url: `/news/${slug}` });

    return {
      data: transformNewsArticle(res),
      ok: true
    };
  } catch (err) {
    return {
      message: err.message,
      ok: false
    };
  }
};
