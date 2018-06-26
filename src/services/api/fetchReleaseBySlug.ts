import transformRelease from "../../transformers/transformRelease";

export default (internet: any) => {
  return async (slug: string) => {
    try {
      const res = await internet({ url: `/releases/${slug}` });

      return {
        data: transformRelease(res),
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
