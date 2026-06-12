"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/auth";
import { authUserMenuLinks, clerkRouting, clerkUserButtonAppearance } from "@/lib/auth";

type AuthUserMenuProps = {
  user: SessionUser;
  clerkEnabled: boolean;
};

function getUserInitials(user: SessionUser) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim();
  return initials || user.fullName[0] || "R";
}

export function AuthUserMenu({ user, clerkEnabled }: AuthUserMenuProps) {
  if (!clerkEnabled) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 text-[#F8FAF8] hover:bg-white/[0.05] light:border-[#0F1720]/8 light:bg-white light:text-[#0F1720]"
            aria-label="Open account menu"
          >
            <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D6F5EC]">
              {getUserInitials(user)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-60 rounded-[1.4rem] border border-white/[0.08] bg-[#10191d]/94 p-2 text-[#F8FAF8] shadow-[0_18px_48px_rgba(0,0,0,0.24)] light:border-[#0F1720]/8 light:bg-white light:text-[#0F1720]"
        >
          <DropdownMenuLabel className="px-3 py-2">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="mt-1 truncate text-xs text-[#94A3B8] light:text-[#64748B]">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/[0.08] light:bg-[#0F1720]/8" />
          {authUserMenuLinks.map((item) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="rounded-xl px-3 py-2.5 focus:bg-white/[0.05] light:focus:bg-[#0F1720]/[0.04]"
            >
              <Link href={item.href} className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-white/[0.08] light:bg-[#0F1720]/8" />
          <DropdownMenuItem
            disabled
            className="rounded-xl px-3 py-2.5 text-[#64748B] focus:bg-transparent light:text-[#64748B]"
          >
            <LogOut size={16} />
            <span>Enable Clerk to sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <UserButton
      appearance={clerkUserButtonAppearance}
      afterSwitchSessionUrl={clerkRouting.signInFallbackRedirectUrl}
      userProfileMode="modal"
      signInUrl={clerkRouting.signInUrl}
    >
      <UserButton.MenuItems>
        {authUserMenuLinks.map((item) => (
          <UserButton.Link
            key={item.href}
            href={item.href}
            label={item.label}
            labelIcon={item.icon}
          />
        ))}
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}
