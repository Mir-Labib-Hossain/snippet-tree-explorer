import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

type Props = {
  path: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteNodeModal({ path, onConfirm, onClose }: Props) {
  const label = path?.split(".").pop() ?? path;

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Delete node"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger" disabled={!path}>
            Delete
          </Button>
        </>
      }
    >
      {path ? (
        <p>
          Are you sure you want to delete <strong>{label}</strong>? This action
          cannot be undone.
        </p>
      ) : (
        <p>Select a node to delete.</p>
      )}
    </Modal>
  );
}
