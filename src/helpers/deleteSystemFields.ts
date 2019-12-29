export default function deleteSystemFields(obj: { [key: string]: any }) {
  const { _id, ...rest } = obj;
  const newObj = { ...rest };

  return newObj;
}
