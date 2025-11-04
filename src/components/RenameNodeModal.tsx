import { useEffect, useState } from "react";
import type { TreeBranch } from "./TreeView";
import { Button } from "./ui/Button";
import { Alert } from "./ui/Alert";
import { Modal } from "./ui/Modal";
import { getSiblingKeys } from "../utils/functions";

type Props = {
  treeData: TreeBranch | null;
  path: string | null;
  onClose: () => void;
  onConfirm: (nextKey: string) => void;
};

export default function RenameNodeModal({
  treeData,
  path,
  onClose,
  onConfirm,
}: Props) {
  const isValidPath = path && treeData;
  const siblingInfo = isValidPath ? getSiblingKeys(treeData, path) : null;
  const label = isValidPath
    ? siblingInfo?.label ?? path.split(".").pop() ?? ""
    : "";
  const siblingKeys = isValidPath ? siblingInfo?.siblings ?? [] : [];
  const parentIsArray = isValidPath
    ? siblingInfo?.parentIsArray ?? false
    : false;

  const [name, setName] = useState(label);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!path || parentIsArray) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please provide a name.");
    } else if (trimmed.includes(".")) {
      setError("Dots are not allowed in key names.");
    } else if (siblingKeys.includes(trimmed)) {
      setError("A sibling with this name already exists.");
    } else {
      onConfirm(trimmed);
    }
  };

  useEffect(() => {
    setName(label);
    setError(null);
  }, [label]);

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Rename node"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!path || parentIsArray}>
            Save
          </Button>
        </>
      }
    >
      {!path ? (
        <p>Select a node to rename.</p>
      ) : parentIsArray ? (
        <p>Renaming array items is not supported.</p>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-700">
            New name
          </label>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            className="block w-full rounded border border-[#C8DAE2] p-2 text-sm"
            placeholder="Enter a new key"
          />
          <Alert variant="error">{error}</Alert>
        </div>
      )}
    </Modal>
  );
}
