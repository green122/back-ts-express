type DataBaseRow = { [key: string]: string | number | boolean | null };

export interface KeyMap<T extends DataBaseRow, K = keyof T> {
  groupKey: K,
  fields: Array<[K, string] | K>,
  groupName?: string,
  oneToOne?: boolean,
  nested?: KeyMap<T> | Array<KeyMap<T>>
}

type Filter<T, U> = T extends U ? T : never;

type DeepObjectStructure = { [key: string]: string | number | boolean | DeepObjectStructure | DeepObjectStructure[] }

export function pickKeys<T>(object: T, keys: Array<[string, string] | string>) {
  const result = keys.reduce((acc, key) => {
    const [keyOld, keyNew] = Array.isArray(key) ? key : [key, key];
    acc[keyNew] = object[keyOld];
    return acc;
  }, {} as Record<string, unknown>);
  return result as Partial<T>;
}

export function unboxOneElementArray<T>(array: T[]): T[] | T {
  return array.length > 1 ? array : array[0];
}

export function groupBy<T extends DataBaseRow, K extends keyof T>(
  objects: Array<Filter<T, DataBaseRow>>, keyMap: KeyMap<T>): { [key: string]: any } | Array<{ [key: string]: any }> {
  const {fields, groupKey, nested, oneToOne, groupName} = keyMap;
  const result = {} as unknown as Record<string, T[]>;

  objects.forEach(object => {
    const groupedValue = {...object}; // pickKeys({...object}, fields);
    const keyValue = object[groupKey] as string | number;
    if (result[keyValue] && nested) {
      result[keyValue].push(groupedValue)
    } else {
      result[keyValue] = [groupedValue];
    }
  });

  if (nested) {
    Object.keys(result).forEach(key => {
      let subGroup = result[key];
      if (Array.isArray(nested)) {
        let subResult = {};
        nested.forEach(nestedElement => {
          const grouped = groupBy(subGroup as any, nestedElement);
          subResult = {...subResult, ...grouped};
        })
        result[key] = [{...subGroup[0], ...subResult}];
      } else {
        const subResult = groupBy(subGroup as any, nested);
        subGroup = [{...subGroup[0], ...subResult}];
        result[key] = subGroup;
      }
    })
  }

  const pickedAndUnboxed = Object.values(result).map(elementArray => {
      let concatedFields = fields as string[];
      if (nested) {
        concatedFields = Array.isArray(nested) ?
          concatedFields.concat(nested.map(element => element.groupName)) :
          concatedFields = concatedFields.concat([nested.groupName])
      }
      const picked = elementArray.map(obj => pickKeys(obj, concatedFields));
      const unboxed = unboxOneElementArray(picked)
      return unboxed;
    }
  );

  // const finalResult = unboxOneElementArray(pickedAndUnboxed) as unknown as DeepObjectStructure;
  const finalResult = (oneToOne ? unboxOneElementArray(pickedAndUnboxed) : pickedAndUnboxed )as unknown as DeepObjectStructure;
  return groupName ? {[groupName]: finalResult} : finalResult;
}



