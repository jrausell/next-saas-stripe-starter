"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TweetSortOption = "newest" | "oldest";

interface TweetSortProps {
  onSort: (value: TweetSortOption) => void;
  value: TweetSortOption;
}

export function TweetSort({ onSort, value }: TweetSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={onSort}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort Order</SelectLabel>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
