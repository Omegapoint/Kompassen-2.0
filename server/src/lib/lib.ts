export interface ID {
  _id?: string;
}

function filterOutKey<T>(obj: T, key: string): Record<string, unknown> {
  return Object.entries(obj).reduce((s, [k, v]) => {
    if (k === key) return s;
    return { ...s, [k]: v };
  }, {});
}

export function filterOutID<T extends ID>(obj: T): Record<string, unknown> {
  return filterOutKey(obj, '_id');
}
