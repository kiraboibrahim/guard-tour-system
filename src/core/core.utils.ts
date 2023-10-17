// Credit goes to: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
export const removeEmpty = (obj: any): any => {
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v === Object(v) ? removeEmpty(v) : v,
      }),
      {},
    );
};

export const isEmptyObjet = (obj: any) => {
  return JSON.stringify(obj) === '{}';
};
