import { useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import type { TreeBranch } from "./TreeView";

function ImportJsonModal({
  treeData,
  setTreeData,
}: {
  treeData: TreeBranch | null;
  setTreeData: React.Dispatch<React.SetStateAction<TreeBranch | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(
    treeData ? JSON.stringify(treeData, null, 2) : "",
  );
  const [error, setError] = useState<string | null>(null);

  function closeModal() {
    setIsOpen(false);
    setText("");
    setError(null);
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(text);

      if (!isTreeRoot(parsed)) {
        throw new Error("Top-level value must be an object or array.");
      }

      setTreeData(parsed);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to parse JSON.");
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Import</Button>
      <Modal
        open={isOpen}
        onClose={closeModal}
        title="Import JSON"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              {treeData ? "Edit" : "Import"}
            </Button>
          </>
        }
      >
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          className="block w-full rounded border border-[#C8DAE2] p-2 font-mono text-sm"
          rows={8}
          placeholder="Paste your JSON here"
        />
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}

export default ImportJsonModal;

function isTreeRoot(value: unknown): value is TreeBranch {
  return typeof value === "object" && value !== null;
}
