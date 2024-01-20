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
