"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, FileText, MapPin, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { AccessibilityMenu } from "./accessibility-menu";
import { NotificationCenter } from "./notification-center";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-background border-b p-4 shadow-sm backdrop-blur-sm bg-opacity-90">
      <div className="flex gap-6 md:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Carteira Digital</span>
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-all hover:text-primary hover:scale-105",
              pathname === "/"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Início</span>
          </Link>
          <Link
            href="/beneficios"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-all hover:text-primary hover:scale-105",
              pathname === "/beneficios"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <Wallet className="h-4 w-4" />
            <span>Benefícios</span>
          </Link>
          <Link
            href="/documentos"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-all hover:text-primary hover:scale-105",
              pathname === "/documentos"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Documentos</span>
          </Link>
          <Link
            href="/agencias"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-all hover:text-primary hover:scale-105",
              pathname === "/agencias"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <MapPin className="h-4 w-4" />
            <span>Agências</span>
          </Link>
          <Link
            href="/configuracoes"
            className={cn(
              "flex items-center space-x-1 text-sm font-medium transition-all hover:text-primary hover:scale-105",
              pathname === "/configuracoes"
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <AccessibilityMenu />
        <NotificationCenter />
      </div>
    </div>
  );
}