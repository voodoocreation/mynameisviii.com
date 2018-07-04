import transformRelease from "../../transformers/transformRelease";

export default (request: any) => async (slug: string) => {
  try {
    const res = await request({ url: `/releases/${slug}` });

    return {
      data: transformRelease(res),
      ok: true
    };
  } catch (err) {
    return {
      message: err.message,
      ok: false
    };
  }
};
