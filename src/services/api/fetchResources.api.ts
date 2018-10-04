import transformResource from "../../transformers/transformResource";

const transformResources = (stems: any) => stems.map(transformResource);

export const fetchResources = (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response = await request({
      params: { exclusiveStartKey, limit },
      url: `/resources/find`
    });

    return {
      data: {
        ...response,
        items: transformResources(response.items)
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
