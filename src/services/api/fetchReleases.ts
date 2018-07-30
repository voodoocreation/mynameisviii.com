import transformRelease from "../../transformers/transformRelease";

export const transformReleases = (releases: any) =>
  releases.map(transformRelease);

export default (request: any) => async (
  limit?: number,
  exclusiveStartKey?: string
) => {
  try {
    const response = await request({
      params: { exclusiveStartKey, limit },
      url: `/releases/find`
    });

    return {
      data: {
        ...response,
        items: transformReleases(response.items)
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
