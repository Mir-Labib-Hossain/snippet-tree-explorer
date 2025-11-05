import "./App.css";
import { useMemo, useState } from "react";

import ImportJsonModal from "./components/ImportJsonModal";
import DeleteNodeModal from "./components/DeleteNodeModal";
import RenameNodeModal from "./components/RenameNodeModal";

import { Button } from "./components/ui/Button";
import { Alert } from "./components/ui/Alert";
import { Card } from "./components/ui/Card";

import TreeView, { type TreeBranch } from "./components/TreeView";

import {
  cloneTree,
  removeNodeAtPath,
  renameNodeAtPath,
  stringifyTreeData,
} from "./utils/functions";

type ModalKey = "importJson" | "deleteNode" | "renameNode";
type LastHistory = {
  treeData: TreeBranch | null;
  selectedPath: string | null;
} | null;

function App() {
  // Get persisted data from localStorage
  const persistedTreeData = localStorage.getItem("treeData");
  const persistedSelectedPath = localStorage.getItem("selectedPath");

  // State Hooks
  const [treeData, setTreeData] = useState<TreeBranch | null>(
    persistedTreeData ? JSON.parse(persistedTreeData) : null,
  );
  const [selectedPath, setSelectedPath] = useState<string | null>(
    persistedSelectedPath ?? null,
  );
  const [lastHistory, setLastHistory] = useState<LastHistory>(null);
  const [modals, setModals] = useState<Record<ModalKey, boolean>>({
    importJson: false,
    deleteNode: false,
    renameNode: false,
  });

  // Memoize the breadcrumb to show navigation path
  const breadcrumb = useMemo(
    () => selectedPath?.split(".").join(" > ") ?? "",
    [selectedPath],
  );

  // Modal management
  const toggleModal = (key: ModalKey) => {
    setModals((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Undo last action
  const undoLastAction = () => {
    if (!lastHistory) return;

    if (lastHistory.treeData) {
      saveTreeData(lastHistory.treeData);
    } else {
      clearTreeData();
    }
    saveSelectedPath(lastHistory.selectedPath ?? null);
  };

  // Save handlers
  const saveTreeData = (data: TreeBranch | null) => {
    setLastHistory({
      treeData: treeData ? cloneTree(treeData) : null,
      selectedPath,
    });
    setTreeData(data);
    localStorage.setItem("treeData", JSON.stringify(data));
  };

  const saveSelectedPath = (path: string | null) => {
    setSelectedPath(path);
    localStorage.setItem("selectedPath", path ?? "");
  };

  // Clear tree and selection
  const clearTreeData = () => {
    saveTreeData(null);
    saveSelectedPath(null);
  };

  // Delete node logic
  const onDelete = () => {
    if (!treeData || !selectedPath) return;

    const clonedTree = cloneTree(treeData);
    const deleted = removeNodeAtPath(clonedTree, selectedPath);
    if (!deleted) return;

    saveTreeData(clonedTree);
    saveSelectedPath(null);
    toggleModal("deleteNode");
  };

  // Rename node logic
  const onRename = (renamedKey: string) => {
    if (!treeData || !selectedPath) return;

    const clonedTree = cloneTree(treeData);
    const renamed = renameNodeAtPath(clonedTree, selectedPath, renamedKey);
    if (!renamed) return;

    saveTreeData(clonedTree);
    const segments = selectedPath.split(".");
    segments[segments.length - 1] = renamedKey;
    saveSelectedPath(segments.join("."));

    toggleModal("renameNode");
  };

  // Handle import confirm
  const onImport = (data: TreeBranch) => {
    saveTreeData(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f3ee]">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="grid grid-cols-10 gap-4 mb-2">
          <p className="col-span-4 text-2xl font-bold tracking-wide text-[#333]">
            Tree
          </p>
          <p className="col-span-6 text-2xl truncate text-[#444]">
            {breadcrumb}
          </p>
        </div>

        <div className="grid grid-cols-10 gap-4">
          {/* Tree Section */}
          <div className="col-span-4">
            {treeData ? (
              <Card className="max-h-[70vh] overflow-auto shadow-md">
                <TreeView
                  data={treeData}
                  selectedPath={selectedPath}
                  onSelectPath={saveSelectedPath}
                  openDeleteModal={() => toggleModal("deleteNode")}
                  openRenameModal={() => toggleModal("renameNode")}
                />
              </Card>
            ) : (
              <Alert>Import a JSON object to explore it as a tree.</Alert>
            )}
          </div>

          {/* JSON View & Controls */}
          <div className="col-span-6 space-y-4">
            {treeData ? (
              <Card className="max-h-[70vh] overflow-auto shadow-md">
                <pre className="whitespace-pre text-sm font-mono cursor-default">
                  {stringifyTreeData(treeData)}
                </pre>
              </Card>
            ) : (
              <Alert>Add a JSON text to view the tree structure.</Alert>
            )}

            {/* Controls */}
            <div className="flex flex-row gap-4">
              <Button onClick={() => toggleModal("importJson")}>
                {treeData ? "Modify" : "Import"}
              </Button>
              <Button
                onClick={undoLastAction}
                variant="secondary"
                disabled={!lastHistory}
              >
                Undo
              </Button>
              <Button
                onClick={clearTreeData}
                variant="danger"
                disabled={!treeData}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modals.importJson && (
        <ImportJsonModal
          treeData={treeData}
          onConfirm={onImport}
          onClose={() => toggleModal("importJson")}
        />
      )}
      {modals.deleteNode && (
        <DeleteNodeModal
          path={selectedPath}
          onConfirm={onDelete}
          onClose={() => toggleModal("deleteNode")}
        />
      )}
      {modals.renameNode && (
        <RenameNodeModal
          treeData={treeData}
          path={selectedPath}
          onConfirm={onRename}
          onClose={() => toggleModal("renameNode")}
        />
      )}
    </div>
  );
}

export default App;
