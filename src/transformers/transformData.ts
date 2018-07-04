export const arrayToAssoc = (
  array: Array<{}>,
  key: string,
  failSilently = true
) =>
  array.reduce(
    (
      acc: { [index: string]: {} },
      curr: { [index: string]: any },
      index: number
    ) => {
      if (curr[key] !== undefined) {
        acc[curr[key]] = curr;
      } else if (!failSilently) {
        throw new Error(`Key '${key}' not found at index ${index}`);
      }
      return acc;
    },
    {}
  );

export const assocToArray: (object: any) => any = object =>
  Object.keys(object).reduce((acc: Array<{}>, curr: string) => {
    acc.push(object[curr]);
    return acc;
  }, []);

export const tryParseJson = (json: any) => {
  let result;

  try {
    let value = json;

    if (json.message) {
      value = json.message;
    }

    result = JSON.parse(value);
  } catch (error) {
    result = json;
  }

  return result;
};

export const lengthToDuration = (length: string) => {
  const segments = length.split(":");

  switch (segments.length) {
    default:
    case 1:
      return `PT${parseInt(segments[0], 10)}S`;

    case 2:
      return `PT${parseInt(segments[0], 10)}M${parseInt(segments[1], 10)}S`;

    case 3:
      return `PT${parseInt(segments[0], 10)}H${parseInt(
        segments[1],
        10
      )}M${parseInt(segments[2], 10)}S`;
  }
};

export const absUrl = (path: string) =>
  process.env.NODE_ENV !== "production"
    ? `http://localhost:${process.env.PORT || window.location.port}${path}`
    : `http://${
        !!process.env.DOMAIN || typeof window === "undefined"
          ? process.env.DOMAIN
          : window.location.host
      }${path}`;

export const extractDomain = (url: string) => url.split("/")[2];
