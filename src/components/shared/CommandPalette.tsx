"use client";

/**
 * Command Palette - Quick navigation and actions (Heuristic 6: Recognition Rather Than Recall)
 * Allows users to quickly find and navigate to pages using search
 */

import React, { useEffect } from "react";
import { useRouter, usePathname } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { useUiStore, selectCommandPaletteOpen } from "@/stores/uiStore";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LayoutGrid,
  Bookmark,
  Tag,
  Users,
  Settings,
  FileText,
  Palette,
  Menu,
  LayoutTemplate,
  Truck,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  keywords: string[];
}

export function CommandPalette() {
  const open = useUiStore(selectCommandPaletteOpen);
  const toggleCommandPalette = useUiStore((state) => state.toggleCommandPalette);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Toggle with Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandPalette]);

  // Define navigation items
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: t("dashboard"),
      href: ROUTES.merchant.dashboard(),
      icon: <LayoutDashboard className="size-4" />,
      keywords: ["home", "overview", "dashboard"],
    },
    {
      id: "orders",
      label: t("orders"),
      href: ROUTES.merchant.orders.list(),
      icon: <ShoppingCart className="size-4" />,
      keywords: ["orders", "sales", "transactions"],
    },
    {
      id: "shipping",
      label: t("shipping"),
      href: ROUTES.merchant.shipping(),
      icon: <Truck className="size-4" />,
      keywords: ["shipping", "delivery", "zones", "methods"],
    },
    {
      id: "products",
      label: t("products"),
      href: ROUTES.merchant.products.list(),
      icon: <Package className="size-4" />,
      keywords: ["products", "inventory", "items"],
    },
    {
      id: "categories",
      label: t("categories"),
      href: ROUTES.merchant.categories.list(),
      icon: <LayoutGrid className="size-4" />,
      keywords: ["categories", "groups", "organization"],
    },
    {
      id: "brands",
      label: t("brands"),
      href: ROUTES.merchant.brands.list(),
      icon: <Bookmark className="size-4" />,
      keywords: ["brands", "labels"],
    },
    {
      id: "tags",
      label: t("tags"),
      href: ROUTES.merchant.tags.list(),
      icon: <Tag className="size-4" />,
      keywords: ["tags", "labels", "filters"],
    },
    {
      id: "pages",
      label: t("pages"),
      href: ROUTES.merchant.cmsPages(),
      icon: <FileText className="size-4" />,
      keywords: ["pages", "content", "marketing"],
    },
    {
      id: "navigation",
      label: t("navigation"),
      href: ROUTES.merchant.navigation.list(),
      icon: <Menu className="size-4" />,
      keywords: ["navigation", "menu", "links"],
    },
    {
      id: "templates",
      label: t("templates"),
      href: ROUTES.merchant.templates.list(),
      icon: <LayoutTemplate className="size-4" />,
      keywords: ["templates", "page templates", "layout", "customizer"],
    },
    {
      id: "themes",
      label: t("themes"),
      href: ROUTES.merchant.theme.overview(),
      icon: <Palette className="size-4" />,
      keywords: ["themes", "appearance", "design", "style"],
    },
    {
      id: "customers",
      label: t("customers"),
      href: ROUTES.merchant.customers.list(),
      icon: <Users className="size-4" />,
      keywords: ["customers", "users", "clients"],
    },
    {
      id: "settings",
      label: t("settings"),
      href: ROUTES.merchant.settings(),
      icon: <Settings className="size-4" />,
      keywords: ["settings", "options", "preferences", "config"],
    },
  ];

  const handleSelect = (href: string) => {
    router.push(href);
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setCommandPaletteOpen}
      title={t('commandPalette')}
      description={t('commandPaletteDescription')}
    >
      <Command>
        <CommandInput placeholder={t('commandPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('noResults')}</CommandEmpty>
          <CommandGroup heading={t('navigation_heading')}>
            {navItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                keywords={item.keywords}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.href === pathname && (
                  <CommandShortcut>{t('current')}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
