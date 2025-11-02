import { useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

function ImportJsonModal({ onImport }: { onImport: (jsonData: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  function closeModal() {
    setIsOpen(false);
    setText("");
  }

  function handleImport() {
    onImport(text);
    closeModal();
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
            <Button onClick={handleImport}>Import</Button>
          </>
        }
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="block w-full rounded border border-[#C8DAE2] p-2 font-mono text-sm" rows={8} placeholder="Paste your JSON here" />
      </Modal>
    </>
  );
}

export default ImportJsonModal;
