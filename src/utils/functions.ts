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
