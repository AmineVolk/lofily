/* eslint-disable no-useless-escape */

import { NBR_HOUR_PER_LOFIMON_LEVEL } from '@/constant';

import { logger } from './logger';

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
    // @ts-expect-error
    targetObject[base] = {};
  }

  // Determine if there is still layers to traverse
  value =
    decomposedPath.length <= 1
      ? value // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      : // @ts-expect-error
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
export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function getYoutubeIdFromURL(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  logger('The supplied URL is not a valid youtube URL');

  return '';
}
export function validateYouTubeUrl(url: string): boolean {
  if (url != undefined || url != '') {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return Boolean(match && match[2].length == 11);
  }
  return false;
}
export const getCurrentFormatedDate = () => {
  const d = new Date();
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// const isIOS = (function () {
//   const iosQuirkPresent = function () {
//     const audio = new Audio();

//     audio.volume = 0.5;
//     return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
//   };

//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//   const isAppleDevice = navigator.userAgent.includes('Macintosh');
//   const isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

//   return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
// })();

export const getLofimonData = (userUsageAppMinutes: number) => {
  const hours = Math.round(userUsageAppMinutes / 60);

  const progression = getLofimonHoursProgressionByUsageMinutes(hours);

  const result = {
    progression_hours: progression,
    max_hours: getLofimonMaxHoursForCurrentLevel(hours),
    level: getLofimonLevel(hours),
  };
  logger('getLofimonData ', { hours, ...result });
  return result;
};

const getLofimonHoursProgressionByUsageMinutes = (
  userUsageAppHours: number
) => {
  if (userUsageAppHours === 0) return 0;
  if (userUsageAppHours >= NBR_HOUR_PER_LOFIMON_LEVEL[3])
    return NBR_HOUR_PER_LOFIMON_LEVEL[3];
  else if (userUsageAppHours >= NBR_HOUR_PER_LOFIMON_LEVEL[2]) {
    return userUsageAppHours - NBR_HOUR_PER_LOFIMON_LEVEL[2];
  }
  return userUsageAppHours;
};

const getLofimonMaxHoursForCurrentLevel = (
  userUsageAppHours: number
): number => {
  if (userUsageAppHours <= NBR_HOUR_PER_LOFIMON_LEVEL[2])
    return NBR_HOUR_PER_LOFIMON_LEVEL[2];
  else return NBR_HOUR_PER_LOFIMON_LEVEL[3];
};

const getLofimonLevel = (userUsageAppHours: number) => {
  if (userUsageAppHours < NBR_HOUR_PER_LOFIMON_LEVEL[2]) return 0;
  else if (userUsageAppHours < NBR_HOUR_PER_LOFIMON_LEVEL[3]) return 1;
  return 2;
};
