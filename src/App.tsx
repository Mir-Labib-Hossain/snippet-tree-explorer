import "./App.css";
import { useState } from "react";
import { Card } from "./components/ui/Card";
import ImportJsonModal from "./components/ImportJsonModal";

function App() {
  const [jsonData, setJsonData] = useState<string | null>(null);
  // {
  //     root: {
  //       src: {
  //         app: null,
  //         img: null,
  //       },
  //       public: {
  //         languages: {
  //           en: null,
  //           bd: null,
  //         },
  //       },
  //     },
  //   }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto space-y-4">
        <div className="grid grid-cols-10 gap-4">
          <p className="text-2xl col-span-4">Tree</p>
          <p className="text-2xl col-span-6">Auto - Driver</p>
        </div>
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-4">
            <Card>
              <h1 className="text-3xl font-bold">Tree View</h1>
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
              {!jsonData && (
                <div className="flex flex-col justify-center items-center gap-2 h-full my-4">
                  <p className="text-sm text-gray-500">Add a JSON text to view the tree structure</p>
                  <ImportJsonModal onImport={setJsonData} />
                </div>
              )}
              {jsonData && <div className="whitespace-pre-wrap text-sm font-mono">{jsonData}</div>}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
