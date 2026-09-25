"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;

export function DropdownMenuContent({ className, children, ...props }: Menu.Popup.Props) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={8} align="end" className="dropdown-positioner">
        <Menu.Popup className={cn("dropdown-content", className)} {...props}>
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function DropdownMenuLink({ className, ...props }: Menu.LinkItem.Props) {
  return <Menu.LinkItem className={cn("dropdown-link", className)} {...props} />;
}
