import transformRelease from "../../transformers/transformRelease";

export const fetchReleaseBySlug = (request: any) => async (slug: string) => {
  try {
    const response = await request({ url: `/releases/${slug}` });

    return {
      data: transformRelease(response),
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};
