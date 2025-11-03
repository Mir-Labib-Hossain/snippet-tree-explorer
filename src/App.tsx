import "./App.css";
import { useState } from "react";
import TreeView, { type TreeBranch } from "./components/TreeView";
import ImportJsonModal from "./components/ImportJsonModal";
import { Card } from "./components/ui/Card";

function App() {
  const [treeData, setTreeData] = useState<TreeBranch | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto space-y-4">
        <div className="grid grid-cols-10 gap-4">
          <p className="col-span-4 text-2xl">Tree</p>
          <p className="col-span-6 text-2xl">Auto - Driver</p>
        </div>
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-4">
            <Card>
              <h1 className="text-3xl font-bold">Tree View</h1>
              <div className="mt-4 max-h-[70vh] overflow-scroll pr-1">
                {treeData ? (
                  <TreeView data={treeData} />
                ) : (
                  <div className="rounded-md bg-[#F1F5F9] px-3 py-2 text-sm text-gray-600">
                    Import a JSON object to explore it as a tree.
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div className="col-span-6 space-y-4">
            <Card>
              <div className="mt-4">
                {treeData ? (
                  <pre className="max-h-[70vh] overflow-auto whitespace-pre text-sm font-mono text-[#1F2937]">
                    {JSON.stringify(treeData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500">
                    Add a JSON text to view the tree structure.
                  </p>
                )}
              </div>
            </Card>
            <ImportJsonModal treeData={treeData} setTreeData={setTreeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
