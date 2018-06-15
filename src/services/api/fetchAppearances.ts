import transformAppearance from "../../domain/transformAppearance";

export const transformAppearances = (appearances: any) =>
  appearances.map(transformAppearance);

export default (internet: any) => {
  return async (limit?: number, exclusiveStartKey?: string) => {
    try {
      const res = await internet({
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
        message: err.message || err.toString(),
        ok: false
      };
    }
  };
};
