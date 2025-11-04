import "./App.css";
import ImportJsonModal from "./components/ImportJsonModal";
import DeleteNodeModal from "./components/DeleteNodeModal";
import RenameNodeModal from "./components/RenameNodeModal";
import { Button } from "./components/ui/Button";
import { Alert } from "./components/ui/Alert";
import { Card } from "./components/ui/Card";
import TreeView, { type TreeBranch } from "./components/TreeView";
import { useMemo, useState } from "react";
import {
  cloneTree,
  removeNodeAtPath,
  renameNodeAtPath,
} from "./utils/functions";

type ModalKey = "importJson" | "deleteNode" | "renameNode";

function App() {
  const persistedTreeData = localStorage.getItem("treeData");
  const persistedSelectedPath = localStorage.getItem("selectedPath");

  const [treeData, setTreeData] = useState<TreeBranch | null>(
    persistedTreeData ? JSON.parse(persistedTreeData) : null,
  );
  const [selectedPath, setSelectedPath] = useState<string | null>(
    persistedSelectedPath ?? null,
  );
  const [modals, setModals] = useState<Record<ModalKey, boolean>>({
    importJson: false,
    deleteNode: false,
    renameNode: false,
  });

  const breadcrumb = useMemo(() => {
    return selectedPath?.split(".").join(" > ") ?? "";
  }, [selectedPath]);

  const toggleModal = (key: ModalKey) => {
    setModals((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveTreeData = (data: TreeBranch) => {
    setTreeData(data);
    localStorage.setItem("treeData", JSON.stringify(data));
  };

  const saveSelectedPath = (path: string | null) => {
    setSelectedPath(path);
    localStorage.setItem("selectedPath", path ?? "");
  };

  const clearTreeData = () => {
    setTreeData(null);
    setSelectedPath(null);
    localStorage.removeItem("treeData");
    localStorage.removeItem("selectedPath");
  };

  const onDelete = () => {
    if (!treeData || !selectedPath) return;

    const clonedTree = cloneTree(treeData);
    const deleted = removeNodeAtPath(clonedTree, selectedPath);
    if (!deleted) return;

    saveTreeData(clonedTree);
    saveSelectedPath(null);
    toggleModal("deleteNode");
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto space-y-4">
        <div className="grid grid-cols-10 gap-4">
          <p className="col-span-4 text-2xl">Tree</p>
          <p className="col-span-6 text-2xl">{breadcrumb}</p>
        </div>
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-4">
            {treeData ? (
              <Card className="max-h-[70vh] overflow-auto">
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
          <div className="col-span-6 space-y-4">
            {treeData ? (
              <Card className="max-h-[70vh] overflow-auto">
                <pre className="whitespace-pre text-sm font-mono text-[#1F2937] cursor-default">
                  {JSON.stringify(treeData, null, 2)}
                </pre>
              </Card>
            ) : (
              <Alert>Add a JSON text to view the tree structure.</Alert>
            )}
            <div className="space-x-4">
              <Button onClick={() => toggleModal("importJson")}>
                {treeData ? "Modify" : "Import"}
              </Button>
              {treeData && (
                <Button onClick={clearTreeData} variant="danger">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {modals.importJson && (
        <ImportJsonModal
          treeData={treeData}
          onConfirm={saveTreeData}
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
