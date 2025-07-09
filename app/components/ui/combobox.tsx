import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface Country {
  value: string;
  label: string;
  flagUrl: string;
}

interface ComboboxProps {
  id?: string;
  data: Country[];
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Combobox({
  id,
  data,
  placeholder = "Select an option...",
  value,
  onValueChange,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = React.useMemo(() => {
    return data.find((item) => item.value === value);
  }, [value, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between px-3 py-2 text-base font-normal",
            !value && "text-gray-500",
            className,
            "flex items-center gap-2"
          )}
          id={id}
        >
          {selectedItem?.flagUrl && (
            <img
              src={selectedItem.flagUrl}
              alt={`${selectedItem.label} flag`}
              className="w-5 h-auto rounded-sm"
            />
          )}
          {selectedItem?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder
              .toLowerCase()
              .replace("select ", "")}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {data.length > 0 ? (
                data.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentLabel) => {
                      const selected = data.find(
                        (c) => c.label === currentLabel
                      );
                      if (selected) {
                        const newValue =
                          selected.value === value ? "" : selected.value;
                        onValueChange(newValue);
                        setOpen(false);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    {item.flagUrl && (
                      <img
                        src={item.flagUrl}
                        alt={`${item.label} flag`}
                        className="w-5 h-auto"
                      />
                    )}
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No data available.</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
