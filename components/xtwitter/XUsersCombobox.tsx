"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { getXUsers, XUserBasic } from "@/lib/query/x-user";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface XUsersComboboxProps {
  onSelect?: (userId: string) => void;
}

export function XUsersCombobox({ onSelect }: XUsersComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<XUserBasic | null>(null);

  const { data: users = [], isLoading } = useQuery<XUserBasic[]>({
    queryKey: ["xusers", search],
    queryFn: () => getXUsers({ search, sortBy: "username", sortOrder: "asc" }),
  });

  const handleSelect = (currentValue: string) => {
    const user = users.find(
      (user) => user.screen_name?.toLowerCase() === currentValue.toLowerCase(),
    );
    if (user) {
      setSelectedUser(user);
      onSelect?.(user.id.toString());
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser?.screen_name || "Select user..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No users found."}
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {users.map((user) => (
                <CommandItem
                  key={user.id.toString()}
                  value={user.screen_name || user.id.toString()}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser?.id === user.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {/* {user.profile_image_url && (
                      <img
                        src={user.profile_image_url}
                        alt={user.name || ""}
                        className="h-6 w-6 rounded-full"
                      />
                    )} */}
                    <span className="font-medium">
                      {user.screen_name || "Unnamed"}
                    </span>
                    {user.name && (
                      <span className="text-muted-foreground">
                        ({user.name})
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
