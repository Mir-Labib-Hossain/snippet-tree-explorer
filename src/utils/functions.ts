import type { TreeBranch } from "../components/TreeView";

type ParentInfo = {
  parent: Record<string, unknown> | unknown[];
  key: string;
};

export const cloneTree = (treeData: TreeBranch): TreeBranch => {
  return JSON.parse(JSON.stringify(treeData)) as TreeBranch;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const getParentAtPath = (
  treeData: TreeBranch,
  path: string,
): ParentInfo | null => {
  const segments = path.split(".");
  const key = segments.pop();

  if (!key) {
    return null;
  }

  let current: unknown = treeData;

  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) {
      return null;
    }

    current = current[segment];
  }

  if (!isRecord(current) && !Array.isArray(current)) {
    return null;
  }

  return { parent: current, key };
};

export const removeNodeAtPath = (
  treeData: TreeBranch,
  path: string,
): boolean => {
  const context = getParentAtPath(treeData, path);

  if (!context) {
    return false;
  }

  const { parent, key } = context;

  if (Array.isArray(parent)) {
    const index = Number(key);

    if (Number.isNaN(index) || index < 0 || index >= parent.length) {
      return false;
    }

    parent.splice(index, 1);
    return true;
  }

  if (!(key in parent)) {
    return false;
  }

  delete parent[key];
  return true;
};

export const renameNodeAtPath = (
  treeData: TreeBranch,
  path: string,
  nextKey: string,
): boolean => {
  const context = getParentAtPath(treeData, path);

  if (!context) {
    return false;
  }

  const { parent, key } = context;

  if (Array.isArray(parent)) {
    return false;
  }

  if (!(key in parent) || key === nextKey || nextKey in parent) {
    return false;
  }

  const record = parent as Record<string, unknown>;
  const entries = Object.entries(record);

  const updatedEntries = entries.map(([entryKey, entryValue]) =>
    entryKey === key ? [nextKey, entryValue] : [entryKey, entryValue],
  );

  for (const existingKey of Object.keys(record)) {
    delete record[existingKey];
  }

  for (const [entryKey, entryValue] of updatedEntries) {
    record[entryKey as keyof typeof record] = entryValue;
  }

  return true;
};

export const getSiblingKeys = (
  treeData: TreeBranch,
  path: string,
): { label: string; siblings: string[]; parentIsArray: boolean } | null => {
  const context = getParentAtPath(treeData, path);

  if (!context) {
    return null;
  }

  const { parent, key } = context;

  if (Array.isArray(parent)) {
    return {
      label: key,
      siblings: parent.map((_, index) => String(index)),
      parentIsArray: true,
    };
  }

  const record = parent as Record<string, unknown>;

  return {
    label: key,
    siblings: Object.keys(record).filter((sibling) => sibling !== key),
    parentIsArray: false,
  };
};
