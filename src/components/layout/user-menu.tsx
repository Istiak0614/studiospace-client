"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, CalendarCheck, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

interface UserMenuProps {
  user: { name: string; email: string; image?: string | null };
}

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

const getInitials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();                 
    toast.success("You've been logged out. See you on set!");
    router.push("/");
    router.refresh();               
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background transition hover:ring-primary focus-visible:outline-none"
      >
        <Avatar className="size-9">
          <AvatarImage src={user.image ?? undefined} alt={user.name} referrerPolicy="no-referrer" />
          <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="glass-strong w-60 rounded-xl p-2">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />

        {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />} className="cursor-pointer rounded-lg">
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}