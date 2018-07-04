import transformAppearance from "../../transformers/transformAppearance";

export const transformAppearances = (appearances: any) =>
  appearances.map(transformAppearance);

export default (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const res = await request({
      params: { exclusiveStartKey, limit },
      url: `/appearances/find`
    });

    return {
      data: {
        ...res,
        items: transformAppearances(res.items)
      },
      ok: true
    };
  } catch (err) {
    return {
      message: err.message,
      ok: false
    };
  }
};
