import { AIRTEL_UG_REGEX, LYCA_UG_REGEX, MTN_UG_REGEX } from './core.constants';
import * as argon2 from 'argon2';

// Credit goes to: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
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

export function removeDuplicates<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export const isEmptyObject = (obj: any) => {
  return JSON.stringify(obj) === '{}';
};

export function isUGPhoneNumber(phoneNumber: string) {
  return (
    MTN_UG_REGEX.test(phoneNumber) ||
    AIRTEL_UG_REGEX.test(phoneNumber) ||
    LYCA_UG_REGEX.test(phoneNumber)
  );
}

export async function hash(value: string) {
  return await argon2.hash(value);
}

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
