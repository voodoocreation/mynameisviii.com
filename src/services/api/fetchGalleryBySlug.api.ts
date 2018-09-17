import transformGallery from "../../transformers/transformGallery";

export const fetchGalleryBySlug = (request: any) => async (slug: string) => {
  try {
    const response = await request({ url: `/galleries/${slug}` });

    return {
      data: transformGallery(response),
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};
