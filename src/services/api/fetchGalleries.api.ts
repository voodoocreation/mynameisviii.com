import transformGallery from "../../transformers/transformGallery";

const transformGalleries = (galleries: any) => galleries.map(transformGallery);

export const fetchGalleries = (request: any) => async (startAfter?: string) => {
  try {
    const response = await request({
      params: { startAfter },
      url: `/galleries/find`
    });

    return {
      data: {
        ...response,
        items: transformGalleries(response.items)
      },
      ok: true
    };
  } catch (error) {
    return {
      message: error.message,
      ok: false
    };
  }
};
