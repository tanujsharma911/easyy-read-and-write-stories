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

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", to: "/" },
    { name: "Create Post", to: "/create" },
    { name: "Communities", to: "/communities" },
  ];

  return (
    <div className="w-full flex items-center justify-between py-4 px-10 border-b border-b-slate-200">
      <div className="flex items-center gap-2">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Easyy!
        </h3>
      </div>

      {/* Desktop Navigation */}
      <NavigationMenu viewport={false} className="hidden md:flex lg:flex">
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.name}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={link.to}>{link.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>

        <NavigationMenuList className="ml-4">
          <div>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="md:hidden lg:hidden">
        {/* Hamburger Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          {/* Sidebar / Drawer */}
          <SheetContent side="left" className="p-4">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div>
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
