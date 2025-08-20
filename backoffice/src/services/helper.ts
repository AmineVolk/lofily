/* eslint-disable no-prototype-builtins */
type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
// !STARTERCONF This OG is generated from https://github.com/theodorusclarence/og
// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
export function openGraph({
  siteName,
  templateTitle,
  description,
  // !STARTERCONF Or, you can use my server with your own logo.
  logo = 'https://og.<your-domain>/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `https://og.<your-domain>/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

/**
 *
 * @param targetObject
 * @param path string lile 'a.b.c'
 * @param value the last field value
 * @returns object like {'a':{'b':{'c':'value'}}}
 */
export function set(targetObject: object, path: string, value: unknown) {
  const decomposedPath = path.split('.');
  const base = decomposedPath[0];

  if (base === undefined) {
    return targetObject;
  }

  // assign an empty object in order to spread object
  if (!targetObject.hasOwnProperty(base)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    targetObject[base] = {};
  }

  // Determine if there is still layers to traverse
  value =
    decomposedPath.length <= 1
      ? value
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        set(targetObject[base], decomposedPath.slice(1).join('.'), value);

  return {
    ...targetObject,
    [base]: value,
  };
}

export function stringToBoolean(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value;
  }
  return value.toLowerCase() === 'true';
}
export function stringToDate(date: string): string {
  const stringToDate = new Date(date);
  return stringToDate.toLocaleDateString('en-GB', {
    // you can use undefined as first argument
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
export const COLOR_ARRAY = [
  '#0088FE',
  '#00C49F',
  '#FF1A66',
  '#E6B333',
  '#FF8042',
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#FF99E6',
  '#CCFF1A',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];
