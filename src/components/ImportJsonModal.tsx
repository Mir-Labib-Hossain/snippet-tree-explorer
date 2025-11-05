import { useState } from "react";
import { Alert } from "./ui/Alert";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import type { TreeBranch } from "./TreeView";
import { stringifyTreeData } from "../utils/functions";
import dummyData from "../../dummy-data.json?raw";

type Props = {
  treeData: TreeBranch | null;
  onConfirm: (data: TreeBranch) => void;
  onClose: () => void;
};

function ImportJsonModal({ treeData, onConfirm, onClose }: Props) {
  const [text, setText] = useState(stringifyTreeData(treeData));
  const [error, setError] = useState<string | null>(null);

  function handleImport() {
    try {
      const parsed = JSON.parse(text);
      const isObject =
        typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);

      if (!isObject) {
        throw new Error("Kindly enter a valid JSON object.");
      }

      if (Object.keys(parsed)?.length !== 1) {
        throw new Error("JSON object must contain exactly one root property.");
      }

      onConfirm(parsed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to parse JSON.");
    }
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Import JSON"
      footer={
        <div className="flex justify-between w-full flex-wrap gap-2">
          <div>
            {!text && (
              <Button
                variant="success"
                onClick={() => {
                  setText(dummyData);
                  if (error) {
                    setError(null);
                  }
                }}
              >
                Save time
                <span className="ml-2 text-sm font-light">
                  (Insert Random Data)
                </span>
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!text}>
              {treeData ? "Update" : "Import"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          className="block w-full rounded border border-[#C8DAE2] p-2 font-mono text-sm h-[60vh]"
          placeholder="Input your JSON here . . ."
        />
        <Alert variant="error">{error}</Alert>
      </div>
    </Modal>
  );
}

export default ImportJsonModal;
