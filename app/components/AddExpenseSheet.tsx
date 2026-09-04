import { IconCamera, IconPhoto, IconPencil, IconChevronRight } from "@tabler/icons-react";

export type AddExpenseOption = "scan" | "photo" | "manual";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  onSelectOption: (option: AddExpenseOption) => void;
}

const options: {
  key: AddExpenseOption;
  icon: React.ReactNode;
  label: string;
  description: string;
}[] = [
  {
    key: "scan",
    icon: <IconCamera size={20} stroke={1.75} />,
    label: "Scan receipt",
    description: "Use your camera",
  },
  {
    key: "photo",
    icon: <IconPhoto size={20} stroke={1.75} />,
    label: "Choose photo",
    description: "Pick from your library",
  },
  {
    key: "manual",
    icon: <IconPencil size={20} stroke={1.75} />,
    label: "Enter manually",
    description: "Type in the details yourself",
  },
];

export function AddExpenseSheet({
  open,
  onClose,
  onSelectOption,
}: AddExpenseSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/35"
      />

      <div className="relative w-full rounded-t-[28px] bg-card px-5 pb-8 pt-2.5">
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-border" />

        <h2 className="mb-1.5 text-[17px]">Add an expense</h2>

        <div className="divide-y divide-border">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onSelectOption(option.key)}
              className="flex w-full items-center gap-3.5 py-3.5 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                {option.icon}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4.5 w-full border-t border-border pt-3.5 text-center text-sm font-medium text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}