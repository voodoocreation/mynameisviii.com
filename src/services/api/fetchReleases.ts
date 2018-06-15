import transformRelease from "../../domain/transformRelease";

export const transformReleases = (releases: any) =>
  releases.map(transformRelease);

export default (internet: any) => {
  return async (limit?: number, exclusiveStartKey?: string) => {
    try {
      const res = await internet({
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
        message: err.message || err.toString(),
        ok: false
      };
    }
  };
};
