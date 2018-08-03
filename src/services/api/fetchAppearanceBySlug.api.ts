import transformAppearance from "../../transformers/transformAppearance";

export const fetchAppearanceBySlug = (request: any) => async (slug: string) => {
  try {
    const response = await request({ url: `/appearances/${slug}` });

    return {
      data: transformAppearance(response),
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};