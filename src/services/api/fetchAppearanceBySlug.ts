import transformAppearance from "../../transformers/transformAppearance";

export default (internet: any) => {
  return async (slug: string) => {
    try {
      const res = await internet({ url: `/appearances/${slug}` });

      return {
        data: transformAppearance(res),
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
