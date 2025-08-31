"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, CreditCard, FileText, MapPin, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationCenter } from '@/components/notification-center';
import { AccessibilityMenu } from '@/components/accessibility-menu';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Benefícios", href: "/beneficios", icon: CreditCard },
    { name: "Documentos", href: "/documentos", icon: FileText },
    { name: "Agências", href: "/agencias", icon: MapPin },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm md:text-lg hidden xs:inline">Carteira</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centralizada */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Botões de Ação - Desktop e Mobile */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <NotificationCenter />
            <AccessibilityMenu />
            <ThemeToggle />
            
            {/* Mobile - Botão do Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="h-5 w-5 text-black dark:text-foreground" /> : <Menu className="h-5 w-5 text-black dark:text-foreground" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default MainNav;