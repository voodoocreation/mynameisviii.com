import transformRelease from "../../transformers/transformRelease";

export const transformReleases = (releases: any) =>
  releases.map(transformRelease);

export default (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const res = await request({
      params: { exclusiveStartKey, limit },
      url: `/releases/find`
    });

    return {
      data: {
        ...res,
        items: transformReleases(res.items)
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
