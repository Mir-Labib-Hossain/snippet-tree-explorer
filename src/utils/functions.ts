import type { TreeBranch } from "../components/TreeView";

type ParentInfo = {
  parent: Record<string, unknown> | unknown[];
  key: string;
};

export function stringifyTreeData(treeData: TreeBranch | null): string {
  return treeData ? JSON.stringify(treeData, null, 2) : "";
}

/**
 *  Deep clone using JSON methods for immutability
 */
export const cloneTree = (treeData: TreeBranch): TreeBranch =>
  JSON.parse(JSON.stringify(treeData)) as TreeBranch;

const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null && !Array.isArray(val);

export function getNodeAtPath(treeData: TreeBranch, path: string): unknown {
  const segments = path.split(".");
  let node: unknown = treeData;

  for (const seg of segments) {
    if (Array.isArray(node)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx) || idx < 0 || idx >= node.length) {
        return undefined;
      }
      node = node[idx];
      continue;
    }

    if (!isRecord(node) || !(seg in node)) {
      return undefined;
    }

    node = (node as Record<string, unknown>)[seg];
  }

  return node;
}

/**
 * Finds the parent object/array and the key for the node at a given path.
 */
export function getParentAtPath(
  treeData: TreeBranch,
  path: string,
): ParentInfo | null {
  const segments = path.split(".");
  const key = segments.pop();
  if (!key) return null;

  let node: unknown = treeData;
  for (const seg of segments) {
    if (!isRecord(node) || !(seg in node)) return null;
    node = node[seg];
  }
  if (!isRecord(node) && !Array.isArray(node)) return null;
  return { parent: node, key };
}

/**
 * Removes the node at the specified path.
 */
export function removeNodeAtPath(treeData: TreeBranch, path: string): boolean {
  const context = getParentAtPath(treeData, path);
  if (!context) return false;
  const { parent, key } = context;

  if (Array.isArray(parent)) {
    const idx = Number(key);
    if (!Number.isInteger(idx) || idx < 0 || idx >= parent.length) return false;
    parent.splice(idx, 1);
    return true;
  }

  if (!(key in parent)) return false;
  delete parent[key];
  return true;
}

/**
 * Renames a key of an object node at the specified path.
 */
export function renameNodeAtPath(
  treeData: TreeBranch,
  path: string,
  nextKey: string,
): boolean {
  const context = getParentAtPath(treeData, path);
  if (!context) return false;

  const { parent, key } = context;
  if (Array.isArray(parent)) return false;
  if (!(key in parent) || key === nextKey || nextKey in parent) return false;

  const obj = parent as Record<string, unknown>;
  obj[nextKey] = obj[key];
  delete obj[key];
  return true;
}

/**
 * Gets label (current key), sibling keys and parent type info.
 */
export function getSiblingKeys(
  treeData: TreeBranch,
  path: string,
): { label: string; siblings: string[]; parentIsArray: boolean } | null {
  const context = getParentAtPath(treeData, path);
  if (!context) return null;
  const { parent, key } = context;

  if (Array.isArray(parent)) {
    return {
      label: key,
      siblings: parent.map((_, idx) => String(idx)),
      parentIsArray: true,
    };
  }

  return {
    label: key,
    siblings: Object.keys(parent as Record<string, unknown>).filter(
      (k) => k !== key,
    ),
    parentIsArray: false,
  };
}

const makeUniqueKey = (
  baseKey: string,
  container: Record<string, unknown>,
): string => {
  if (!(baseKey in container)) return baseKey;

  let index = 1;
  let candidate = `${baseKey}_${index}`;
  while (candidate in container) {
    index += 1;
    candidate = `${baseKey}_${index}`;
  }
  return candidate;
};

export function moveNode(
  treeData: TreeBranch,
  fromPath: string,
  toPath: string,
): string | null {
  if (fromPath === toPath || toPath.startsWith(`${fromPath}.`)) {
    return null;
  }

  const target = getNodeAtPath(treeData, toPath);
  if (!isRecord(target) && !Array.isArray(target)) {
    return null;
  }

  const sourceContext = getParentAtPath(treeData, fromPath);
  if (!sourceContext) return null;

  const { parent, key } = sourceContext;
  const keyAsString = String(key);

  let value: unknown;

  if (Array.isArray(parent)) {
    const idx = Number(keyAsString);
    if (!Number.isInteger(idx) || idx < 0 || idx >= parent.length) {
      return null;
    }
    value = parent[idx];
    parent.splice(idx, 1);
  } else {
    if (!(keyAsString in parent)) {
      return null;
    }
    value = (parent as Record<string, unknown>)[keyAsString];
    delete (parent as Record<string, unknown>)[keyAsString];
  }

  if (Array.isArray(target)) {
    target.push(value);
    return `${toPath}.${target.length - 1}`;
  }

  const targetRecord = target as Record<string, unknown>;
  const hasSameParent = target === parent;
  const nextKey = hasSameParent
    ? keyAsString
    : makeUniqueKey(keyAsString, targetRecord);

  targetRecord[nextKey] = value;

  return `${toPath}.${nextKey}`;
}
