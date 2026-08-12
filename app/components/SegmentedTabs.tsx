import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SegmentedTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SegmentedTabs({ value, onValueChange }: SegmentedTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full gap-1.5 rounded-full border border-border bg-card p-1">
        <TabsTrigger
          value="all"
          className="flex-1 rounded-full text-xs font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="you-owe"
          className="flex-1 rounded-full text-xs font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
        >
          You owe
        </TabsTrigger>
        <TabsTrigger
          value="owed-to-you"
          className="flex-1 rounded-full text-xs font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:font-semibold data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
        >
          Owed to you
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}