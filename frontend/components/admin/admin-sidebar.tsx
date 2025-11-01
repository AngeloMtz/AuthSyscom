"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  BarChart3,
  Bell,
  FileText,
  Settings,
  User,
  ChevronDown,
  ShoppingCart,
  Star,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Panel Principal",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Gestión de Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    children: [
      { name: "Usuarios Internos", href: "/admin/usuarios/internos" },
      { name: "Clientes Registrados", href: "/admin/usuarios/clientes" },
    ],
  },
  {
    name: "Gestión de Catálogo",
    href: "/admin/catalogo",
    icon: Package,
    children: [
      { name: "Productos", href: "/admin/catalogo/productos" },
      { name: "Servicios Técnicos", href: "/admin/catalogo/servicios" },
    ],
  },
  {
    name: "Ventas y Pedidos",
    href: "/admin/ventas",
    icon: ShoppingCart,
  },
  {
    name: "Promociones",
    href: "/admin/promociones",
    icon: Tag,
  },
  {
    name: "Moderación de Reseñas",
    href: "/admin/resenas",
    icon: Star,
  },
  {
    name: "Reportes",
    href: "/admin/reportes",
    icon: BarChart3,
  },
  {
    name: "Notificaciones",
    href: "/admin/notificaciones",
    icon: Bell,
  },
  {
    name: "Información Institucional",
    href: "/admin/institucional",
    icon: FileText,
  },
  {
    name: "Mantenimiento",
    href: "/admin/mantenimiento",
    icon: Settings,
  },
  {
    name: "Mi Perfil",
    href: "/admin/perfil",
    icon: User,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background hidden lg:block overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const isExpanded = expandedItems.includes(item.name)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.name}>
              {hasChildren ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between hover:bg-gradient-to-r hover:from-[#3857B0]/10 hover:to-[#2E78BF]/10 hover:text-[#3857B0] transition-all",
                      isActive && "bg-gradient-to-r from-[#3857B0]/10 to-[#2E78BF]/10 text-[#3857B0] font-semibold",
                    )}
                    onClick={() => toggleExpanded(item.name)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                  </Button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 animate-fade-in">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "px-3 py-2 text-sm rounded-md hover:bg-gradient-to-r hover:from-[#2E78BF]/10 hover:to-[#329ACF]/10 hover:text-[#3857B0] transition-all",
                              isChildActive &&
                                "bg-gradient-to-r from-[#2E78BF]/10 to-[#329ACF]/10 text-[#3857B0] font-semibold",
                            )}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#3857B0]/10 hover:to-[#2E78BF]/10 hover:text-[#3857B0] transition-all",
                    isActive && "bg-gradient-to-r from-[#3857B0]/10 to-[#2E78BF]/10 text-[#3857B0] font-semibold",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
