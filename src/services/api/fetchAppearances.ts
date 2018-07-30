import transformAppearance from "../../transformers/transformAppearance";

export const transformAppearances = (appearances: any) =>
  appearances.map(transformAppearance);

export default (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response = await request({
      params: { exclusiveStartKey, limit },
      url: `/appearances/find`
    });

    return {
      data: {
        ...response,
        items: transformAppearances(response.items)
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
