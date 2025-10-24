"use client";
import { Link, useNavigate } from "react-router";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../../app/store";
import ThemeBtn from "./ThemeBtn";

export default function Header() {
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state: RootState) => state.auth.status);
  // const userData = useSelector((state: RootState) => state.auth.userData);
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Write",
      to: "/create-article",
      active: userLoggedIn,
    },
    {
      name: "Account",
      to: "/account",
      active: userLoggedIn,
    },
  ];

  return (
    <div>
      <nav className="w-full flex bg-transparent items-center justify-between py-4 px-5 sm:px-18 border-b border-b-slate-200 dark:border-b-slate-600">
        <div className="flex items-center gap-2">
          <h3 className="scroll-m-20 text-2xl font-sans font-semibold tracking-tight">
            Easyy!
          </h3>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu viewport={false} className="hidden md:flex lg:flex">
          <NavigationMenuList>
            {links.map((link) =>
              !link.active ? null : (
                <NavigationMenuItem key={link.name} className="bg-transparent">
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle() + " bg-transparent"}
                  >
                    <Link to={link.to}>{link.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>

          {!userLoggedIn && (
            <NavigationMenuList className="ml-4">
              <div>
                <Button onClick={() => navigate("/login")}>Login</Button>
              </div>
            </NavigationMenuList>
          )}
        </NavigationMenu>

        {/* Mobile Navigation */}
        <div className="md:hidden lg:hidden">
          {/* Hamburger Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                aria-haspopup="menu"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            {/* Sidebar / Drawer */}
            <SheetContent side="left" className="p-4">
              <nav className="flex flex-col gap-4" role="menu">
                {links.map((link) =>
                  !link.active ? null : (
                    <Link
                      key={link.name}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      role="menuitem"
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </nav>
              {!userLoggedIn && (
                <NavigationMenuList className="ml-4">
                  <div>
                    <Button onClick={() => navigate("/login")} role="menuitem">
                      Login
                    </Button>
                  </div>
                </NavigationMenuList>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <ThemeBtn />
      </nav>
    </div>
  );
}
