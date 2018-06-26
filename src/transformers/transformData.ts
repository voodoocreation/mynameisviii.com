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

export const tryParseJson = (json: string | Error) => {
  let result;

  try {
    result = json.toString ? JSON.parse(json.toString()) : json;
  } catch (error) {
    result = json;
  }

  return result;
};

export const lengthToDuration = (length: string) => {
  const segments = length.split(":");

  switch (segments.length) {
    default:
    case 2:
      return `PT${segments[0]}M${segments[1]}S`;

    case 3:
      return `PT${segments[0]}H${segments[1]}M${segments[2]}S`;
  }
};

export const absUrl = (path: string) =>
  process.env.NODE_ENV !== "production"
    ? `http://localhost:${process.env.PORT || window.location.port}${path}`
    : `http://${
        typeof window === "undefined"
          ? process.env.DOMAIN
          : window.location.host
      }${path}`;

export const extractDomain = (url: string) => url.split("/")[2];
