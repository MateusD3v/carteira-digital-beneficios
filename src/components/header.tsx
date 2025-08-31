'use client';

import { ThemeToggle } from './theme-toggle';
import { NotificationCenter } from './notification-center';
import { AccessibilityMenu } from './accessibility-menu';

export function Header() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      {/* Botão de Notificações */}
      <NotificationCenter className="" />
      
      {/* Botão de Acessibilidade */}
      <AccessibilityMenu className="" />
      
      {/* Botão de Modo Escuro */}
      <ThemeToggle />
    </div>
  );
}

export default Header;