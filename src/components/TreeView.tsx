import {
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";

export type TreeBranch = Record<string, unknown>;

type Props = {
  data: TreeBranch;
  selectedPath: string | null;
  openDeleteModal: () => void;
  openRenameModal: () => void;
  onSelectPath: (path: string) => void;
  onMoveNode: (sourcePath: string, targetPath: string) => void;
};

type TreeNodeProps = {
  label: string;
  value: unknown;
  path: string;
  prefix: string;
  isLast: boolean;
  parentIsArray: boolean;
  selectedPath: string | null;
  openDeleteModal: () => void;
  openRenameModal: () => void;
  onSelectPath: (path: string) => void;
  onMoveNode: (sourcePath: string, targetPath: string) => void;
  draggedPath: string | null;
  setDraggedPath: Dispatch<SetStateAction<string | null>>;
  dropTargetPath: string | null;
  setDropTargetPath: Dispatch<SetStateAction<string | null>>;
};

export default function TreeView({ data, onMoveNode, ...props }: Props) {
  const entries = getChildItems(data);
  const [draggedPath, setDraggedPath] = useState<string | null>(null);
  const [dropTargetPath, setDropTargetPath] = useState<string | null>(null);

  if (entries?.length === 0) return null;

  return (
    <div>
      {entries.map(([key, value], index) => (
        <TreeNode
          key={key}
          label={key}
          value={value}
          path={key}
          prefix=""
          isLast={index === entries.length - 1}
          parentIsArray={Array.isArray(data)}
          onMoveNode={onMoveNode}
          draggedPath={draggedPath}
          setDraggedPath={setDraggedPath}
          dropTargetPath={dropTargetPath}
          setDropTargetPath={setDropTargetPath}
          {...props}
        />
      ))}
    </div>
  );
}

function TreeNode({
  label,
  value,
  path,
  prefix,
  isLast,
  parentIsArray,
  selectedPath,
  openDeleteModal,
  openRenameModal,
  onSelectPath,
  onMoveNode,
  draggedPath,
  setDraggedPath,
  dropTargetPath,
  setDropTargetPath,
}: TreeNodeProps) {
  const childItems = getChildItems(value);
  const isExpandable = childItems.length > 0;
  const [isOpen, setIsOpen] = useState(true);
  const NBSP = "\u00A0";
  const normalizedPrefix = prefix.replace(/ /g, NBSP);
  const branchConnector = isLast ? `${NBSP}┗${NBSP}` : `${NBSP}┣${NBSP}`;
  const connector = `${normalizedPrefix}${branchConnector}`;
  const rootPadding = NBSP.repeat(6);
  const arrow = (
    <span
      className={`pl-3 pr-2 font-bold duration-500 ${
        isOpen ? "rotate-90" : "rotate-0"
      }`}
    >
      ›
    </span>
  );
  const nodeLabelPrefix = (
    <>
      {prefix ? connector : rootPadding}
      {isExpandable && arrow}
    </>
  );

  const onExpandToggle = () => {
    onSelectPath(path);
    if (isExpandable) {
      setIsOpen((prev) => !prev);
    }
  };

  const isChildNode = Boolean(prefix);
  const showRename = !parentIsArray;
  const isContainer = value !== null && typeof value === "object";
  const isDropTarget = dropTargetPath === path;
  const displayLabel =
    parentIsArray && (value === null || typeof value !== "object")
      ? String(value)
      : label;

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", path);
    event.dataTransfer.effectAllowed = "move";
    setDraggedPath(path);
    setDropTargetPath(null);
  };

  const handleDragEnd = () => {
    setDraggedPath(null);
    setDropTargetPath(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!isContainer) return;

    const sourcePath = draggedPath ?? event.dataTransfer.getData("text/plain");
    if (
      !sourcePath ||
      sourcePath === path ||
      path.startsWith(`${sourcePath}.`)
    ) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetPath(path);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!isContainer) return;

    const sourcePath = draggedPath ?? event.dataTransfer.getData("text/plain");
    if (
      !sourcePath ||
      sourcePath === path ||
      path.startsWith(`${sourcePath}.`)
    ) {
      return;
    }

    setDropTargetPath(path);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!isContainer) return;

    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setDropTargetPath((current) => (current === path ? null : current));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!isContainer) return;

    const sourcePath = draggedPath ?? event.dataTransfer.getData("text/plain");
    if (
      !sourcePath ||
      sourcePath === path ||
      path.startsWith(`${sourcePath}.`)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onMoveNode(sourcePath, path);
    setIsOpen(true);
    setDraggedPath(null);
    setDropTargetPath(null);
  };

  return (
    <div>
      <div
        className={`flex justify-between cursor-pointer select-none rounded-md px-1 transition-colors group ${
          isDropTarget
            ? "bg-[#eaf0f9] ring-1 ring-[#4F92EE] shadow-[0_0_10px_rgba(79,146,238,0.5)]"
            : ""
        }`}
        onClick={onExpandToggle}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="whitespace-pre-wrap flex items-center">
          <span className="text-[30px] leading-[30px] flex items-center font-extralight text-[#232323]">
            {nodeLabelPrefix}
          </span>
          <span
            className={`text-lg duration-500 group-hover:text-[#4F92EE] ${
              selectedPath === path ? "text-[#4F92EE]" : ""
            }`}
          >
            {displayLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showRename && (
            <ActionButton
              variant="rename"
              onClick={() => {
                onSelectPath(path);
                openRenameModal();
              }}
            />
          )}
          {isChildNode && (
            <ActionButton
              variant="delete"
              onClick={() => {
                onSelectPath(path);
                openDeleteModal();
              }}
            />
          )}
        </div>
      </div>
      {isExpandable && isOpen && (
        <div>
          {childItems.map(([childKey, childValue], index) => (
            <TreeNode
              key={`${path}.${childKey}`}
              label={childKey}
              value={childValue}
              path={`${path}.${childKey}`}
              prefix={`${normalizedPrefix}${
                isLast ? NBSP.repeat(5) : `${NBSP}┃`
              }`}
              isLast={index === childItems.length - 1}
              selectedPath={selectedPath}
              openDeleteModal={openDeleteModal}
              openRenameModal={openRenameModal}
              onSelectPath={onSelectPath}
              parentIsArray={Array.isArray(value)}
              onMoveNode={onMoveNode}
              draggedPath={draggedPath}
              setDraggedPath={setDraggedPath}
              dropTargetPath={dropTargetPath}
              setDropTargetPath={setDropTargetPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ActionButton = ({
  onClick,
  variant,
}: {
  onClick: () => void;
  variant: "rename" | "delete";
}) => {
  const variantClasses = {
    rename: "bg-[#76a7eb]",
    delete: "bg-[#E3494B]",
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      className={`text-white w-6 h-6 flex items-center justify-center rounded-full cursor-pointer text-xs ${variantClasses[variant]}`}
      onClick={handleClick}
    >
      {variant === "rename" ? "✎" : "—"}
    </button>
  );
};

function getChildItems(value: unknown): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>);
  }

  return [];
}
