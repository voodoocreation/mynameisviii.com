import transformNewsArticle from "../../domain/transformNewsArticle";

export default (internet: any) => {
  return async (slug: string) => {
    try {
      const res = await internet({ url: `/news/${slug}` });

      return {
        data: transformNewsArticle(res),
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
