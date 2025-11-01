"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, Wrench, MessageSquare, Tag, BarChart3, User, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Panel Operativo",
    href: "/staff",
    icon: LayoutDashboard,
  },
  {
    name: "Gestión de Clientes",
    href: "/staff/clientes",
    icon: Users,
    children: [
      { name: "Buscar Cliente", href: "/staff/clientes/buscar" },
      { name: "Historial", href: "/staff/clientes/historial" },
    ],
  },
  {
    name: "Gestión de Pedidos",
    href: "/staff/pedidos",
    icon: Package,
    children: [
      { name: "Pedidos Recientes", href: "/staff/pedidos" },
      { name: "Actualizar Estados", href: "/staff/pedidos/estados" },
      { name: "Problemas de Entrega", href: "/staff/pedidos/problemas" },
    ],
  },
  {
    name: "Solicitudes de Servicio",
    href: "/staff/servicios",
    icon: Wrench,
    children: [
      { name: "Nuevas Solicitudes", href: "/staff/servicios" },
      { name: "Asignar Técnico", href: "/staff/servicios/asignar" },
      { name: "Seguimiento", href: "/staff/servicios/seguimiento" },
    ],
  },
  {
    name: "Centro de Atención",
    href: "/staff/atencion",
    icon: MessageSquare,
    children: [
      { name: "Chat en Tiempo Real", href: "/staff/atencion/chat" },
      { name: "Consultas del Chatbot", href: "/staff/atencion/chatbot" },
      { name: "Plantillas", href: "/staff/atencion/plantillas" },
    ],
  },
  {
    name: "Promociones",
    href: "/staff/promociones",
    icon: Tag,
  },
  {
    name: "Reportes Operativos",
    href: "/staff/reportes",
    icon: BarChart3,
  },
  {
    name: "Mi Perfil",
    href: "/staff/perfil",
    icon: User,
  },
]

export function StaffSidebar() {
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
                      "w-full justify-between hover:bg-gradient-to-r hover:from-[#329ACF]/10 hover:to-[#2E78BF]/10 hover:text-[#329ACF] transition-all",
                      isActive && "bg-gradient-to-r from-[#329ACF]/10 to-[#2E78BF]/10 text-[#329ACF] font-semibold",
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
                              "px-3 py-2 text-sm rounded-md hover:bg-gradient-to-r hover:from-[#54A9D1]/10 hover:to-[#329ACF]/10 hover:text-[#329ACF] transition-all",
                              isChildActive &&
                                "bg-gradient-to-r from-[#54A9D1]/10 to-[#329ACF]/10 text-[#329ACF] font-semibold",
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
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#329ACF]/10 hover:to-[#2E78BF]/10 hover:text-[#329ACF] transition-all",
                    isActive && "bg-gradient-to-r from-[#329ACF]/10 to-[#2E78BF]/10 text-[#329ACF] font-semibold",
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
