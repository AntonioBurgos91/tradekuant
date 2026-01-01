'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Upload,
  Database,
  Settings,
  BarChart3,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Subir CSV',
    href: '/admin/upload',
    icon: Upload,
  },
  {
    title: 'Snapshots',
    href: '/admin/snapshots',
    icon: Database,
  },
  {
    title: 'Métricas',
    href: '/admin/metrics',
    icon: BarChart3,
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold">TradeKuant</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Volver al inicio' : undefined}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Volver al inicio</span>}
        </Link>

        {user && (
          <>
            {!collapsed && (
              <div className="mt-2 rounded-lg bg-sidebar-accent/30 px-3 py-2">
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                'mt-2 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive',
                collapsed && 'justify-center px-2'
              )}
              onClick={logout}
              title={collapsed ? 'Cerrar sesión' : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Cerrar sesión</span>}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}
