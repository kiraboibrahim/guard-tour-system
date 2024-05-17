// Credit goes to: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
import { AIRTEL_UG_REGEX, LYCA_UG_REGEX, MTN_UG_REGEX } from './core.constants';
import * as argon2 from 'argon2';

export const removeEmptyObjects = (obj: any): any => {
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v === Object(v) ? removeEmptyObjects(v) : v,
      }),
      {},
    );
};

export const isEmptyObjet = (obj: any) => {
  return JSON.stringify(obj) === '{}';
};

export const applyMixins = (
  derivedConstructor: any,
  ...baseConstructors: any[]
) => {
  baseConstructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedConstructor.prototype[name] = baseCtor.prototype[name];
    });
  });
};

export function getHoursDiff(datetime: string) {
  // TODO: Use a date timezone aware library than the native Date library
  const _datetime = new Date(datetime).getTime();
  const now = new Date().getTime();
  let milliSecondDiff;
  if (_datetime < now) {
    milliSecondDiff = now - _datetime;
  } else {
    milliSecondDiff = _datetime - now;
  }
  const daysDiff = Math.floor(milliSecondDiff / 1000 / 60 / (60 * 24));
  const daysDiffInHours = daysDiff * 24;

  const dateDiff = new Date(milliSecondDiff);
  const hoursDiff = dateDiff.getHours();
  const minutesDiffInHours = dateDiff.getMinutes() / 60;

  return daysDiffInHours + hoursDiff + minutesDiffInHours;
}

export function isUGPhoneNumber(phoneNumber: string) {
  return (
    MTN_UG_REGEX.test(phoneNumber) ||
    AIRTEL_UG_REGEX.test(phoneNumber) ||
    LYCA_UG_REGEX.test(phoneNumber)
  );
}

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}
