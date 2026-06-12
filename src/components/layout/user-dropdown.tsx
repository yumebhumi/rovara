"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ChevronDown, LogOut } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { clerkRouting } from "@/lib/auth";
import { userMenuNav } from "@/config/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

type UserDropdownProps = {
  user: SessionUser;
  clerkEnabled: boolean;
  isActive?: boolean;
};

function getUserInitials(user: SessionUser) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim();
  return initials || user.fullName[0] || "R";
}

export function UserDropdown({ user, clerkEnabled, isActive = false }: UserDropdownProps) {
  const initials = getUserInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full border px-2.5 pr-3 text-[#F8FAF8]",
            "bg-white/[0.03] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-px hover:bg-white/[0.05]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30",
            isActive ? "border-[#14B8A6]/24 bg-white/[0.05]" : "border-white/[0.08]"
          )}
          aria-label="Open account menu"
          aria-haspopup="menu"
        >
          <span
            className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#14B8A6]/12 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#DDF9F1]"
            style={
              user.imageUrl
                ? {
                    backgroundImage: `url(${user.imageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    color: "transparent"
                  }
                : undefined
            }
          >
            {initials}
          </span>
          <ChevronDown size={15} className="text-[#94A3B8]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-60 rounded-[1.35rem] border border-white/[0.08] bg-[#10191d]/96 p-2 text-[#F8FAF8] shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <p className="truncate text-sm font-medium tracking-[-0.01em] text-[#F8FAF8]">
            {user.fullName}
          </p>
          <p className="mt-1 truncate text-xs text-[#94A3B8]">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.08]" />

        {userMenuNav.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="cursor-pointer rounded-[0.95rem] px-3 py-2.5 text-[#F8FAF8] focus:bg-white/[0.05] focus:text-[#F8FAF8]"
            >
              <Link href={item.href} className="flex items-center gap-2.5">
                <Icon size={16} className="text-[#8FE3CF]" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="bg-white/[0.08]" />

        {clerkEnabled ? (
          <SignOutButton redirectUrl={clerkRouting.afterSignOutUrl}>
            <DropdownMenuItem className="cursor-pointer rounded-[0.95rem] px-3 py-2.5 text-[#F8FAF8] focus:bg-white/[0.05] focus:text-[#F8FAF8]">
              <LogOut size={16} className="text-[#8FE3CF]" />
              <span>Logout</span>
            </DropdownMenuItem>
          </SignOutButton>
        ) : (
          <DropdownMenuItem
            disabled
            className="rounded-[0.95rem] px-3 py-2.5 text-[#64748B] focus:bg-transparent"
          >
            <LogOut size={16} />
            <span>Enable Clerk to logout</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
