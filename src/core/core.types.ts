export type EntityClass<T> = { new (...args: any[]): T };
export type EntityColumnName<T> = keyof T;
