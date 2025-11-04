import { useState } from "react";

export type TreeBranch = Record<string, unknown>;

type Props = {
  data: TreeBranch;
  selectedPath: string | null;
  openDeleteModal: () => void;
  openRenameModal: () => void;
  onSelectPath: (path: string) => void;
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
};

export default function TreeView({ data, ...props }: Props) {
  const entries = getChildItems(data);

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
}: TreeNodeProps) {
  const childItems = getChildItems(value);
  const isExpandable = childItems.length > 0;
  const [isOpen, setIsOpen] = useState(true);
  const connector = `${prefix}${isLast ? " ┗ " : " ┣ "}`;
  const arrow = (
    <span
      className={`px-2 font-bold duration-500 ${
        isOpen ? "rotate-90" : "rotate-0"
      }`}
    >
      ›
    </span>
  );
  const nodeLabelPrefix = (
    <>
      {prefix ? connector : "       "}
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

  return (
    <div>
      <div className="flex justify-between">
        <div
          className="whitespace-pre-wrap cursor-pointer select-none flex items-center"
          onClick={onExpandToggle}
        >
          <span className="text-[30px] leading-[30px] flex items-center font-extralight">
            {nodeLabelPrefix}
          </span>
          <span
            className={`text-lg hover:text-[#4F92EE] duration-500 ${
              selectedPath === path ? "text-[#4F92EE]" : ""
            }`}
          >
            {label}
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
              prefix={`${prefix}${isLast ? "     " : " ┃"}`}
              isLast={index === childItems.length - 1}
              selectedPath={selectedPath}
              openDeleteModal={openDeleteModal}
              openRenameModal={openRenameModal}
              onSelectPath={onSelectPath}
              parentIsArray={Array.isArray(value)}
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
    rename: "bg-[#4F92EE]",
    delete: "bg-[#E3494B]",
  };
  return (
    <button
      type="button"
      className={`text-white w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-xs ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {variant === "rename" ? "✎" : "-"}
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
