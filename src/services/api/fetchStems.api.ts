import transformStem from "../../transformers/transformStem";

const transformStems = (stems: any) => stems.map(transformStem);

export const fetchStems = (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response = await request({
      params: { exclusiveStartKey, limit },
      url: `/stems/find`
    });

    return {
      data: {
        ...response,
        items: transformStems(response.items)
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
