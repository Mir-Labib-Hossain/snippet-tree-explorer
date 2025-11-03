import { useState } from "react";

export type TreeBranch = Record<string, unknown> | unknown[];

type TreeViewProps = {
  data: TreeBranch;
};

type TreeNodeProps = {
  label: string;
  value: unknown;
  path: string;
  prefix: string;
  isLast: boolean;
};

export default function TreeView({ data }: TreeViewProps) {
  const entries = getChildItems(data);

  if (entries.length === 0) {
    return null;
  }

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
        />
      ))}
    </div>
  );
}

function TreeNode({ label, value, path, prefix, isLast }: TreeNodeProps) {
  const childItems = getChildItems(value);
  const isExpandable = childItems.length > 0;
  const [isOpen, setIsOpen] = useState(true);
  const connector = `${prefix}${isLast ? " ┗ " : " ┣ "}`;
  const arrow = (
    <>
      {" "}
      <span
        className={`font-bold duration-500 ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        ›
      </span>
    </>
  );
  const nodeLabelPrefix = (
    <>
      {prefix ? connector : "       "}
      {isExpandable && arrow}
    </>
  );

  const handleToggle = () => {
    if (isExpandable) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div>
      <div
        className={`whitespace-pre-wrap ${
          isExpandable ? "cursor-pointer select-none" : ""
        } flex items-center`}
        onClick={handleToggle}
      >
        <span className="text-[30px] leading-[30px] flex items-center font-extralight">
          {nodeLabelPrefix}
        </span>
        <span className="text-lg">{label}</span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getChildItems(value: unknown): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>);
  }

  return [];
}

// const light = "│└├ ";
// const dark = " ┃ ┗ ┣ ";
