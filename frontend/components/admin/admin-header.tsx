"use client"

import { Bell, Menu, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/images/syscom-logo.png" alt="SYSCOM" width={120} height={40} className="h-8 w-auto" />
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-[#3857B0] to-[#2E78BF] text-white hover:from-[#2E78BF] hover:to-[#329ACF]"
            >
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#3857B0] animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Alertas del Sistema</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-semibold text-sm">Inventario bajo: Laptop HP</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-4">Hace 10 minutos</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-2 w-2 rounded-full bg-[#3857B0]" />
                    <span className="font-semibold text-sm">Nueva reseña pendiente</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-4">Hace 25 minutos</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold text-sm">Respaldo completado</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3857B0] to-[#2E78BF] flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:inline-block font-medium">Admin Principal</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Panel de Administración</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/perfil">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Configuración del Sistema</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
