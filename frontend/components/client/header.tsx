"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, Search, Heart, ChevronDown, LogOut, UserCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"
import { cerrarSesion } from "@/lib/auth"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await cerrarSesion()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      logout() // Limpiar store local
      router.push("/")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top announcement bar */}
      <div className="bg-[#329ACF] text-white py-2 px-4 text-center text-sm">
        <p>🎉 Promociones especiales en productos seleccionados - ¡Hasta 30% de descuento!</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image src="/images/syscom-logo.png" alt="Syscom Logo" width={140} height={50} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-[#329ACF] transition-colors">
                Productos <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/#">Ver todos los productos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#">Computadoras</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#">Componentes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#">Periféricos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#">Redes</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/#"
              className="text-sm font-medium text-foreground hover:text-[#329ACF] transition-colors"
            >
              Servicios
            </Link>

            <Link
              href="/#"
              className="text-sm font-medium text-foreground hover:text-[#329ACF] transition-colors"
            >
              Promociones
            </Link>

            <Link
              href="/#"
              className="text-sm font-medium text-foreground hover:text-[#329ACF] transition-colors"
            >
              Soporte
            </Link>

            <Link
              href="/#"
              className="text-sm font-medium text-foreground hover:text-[#329ACF] transition-colors"
            >
              Nosotros
            </Link>
          </nav>

          <div className="hidden lg:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#329ACF]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
              <Link href="/#">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Link href="/#">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#329ACF] text-white text-xs flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* User Menu - Condicional según autenticación */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-3">
                    <div className="h-8 w-8 rounded-full bg-[#329ACF] text-white flex items-center justify-center font-semibold">
                      {user.nombre.charAt(0)}{user.apellidos.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium leading-none">{user.nombre}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.rol}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.nombre} {user.apellidos}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Opciones según rol */}
                  {user.rol === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          Panel de Administración
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/usuarios" className="cursor-pointer">
                          Gestionar Usuarios
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {user.rol === "vendedor" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/ventas/dashboard" className="cursor-pointer">
                          Panel de Ventas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/ventas/pedidos" className="cursor-pointer">
                          Mis Pedidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Opciones comunes */}
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos" className="cursor-pointer">
                      Mis Compras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracion" className="cursor-pointer">
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Menú cuando NO está autenticado
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer">
                      Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="cursor-pointer">
                      Registro
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#329ACF]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {isAuthenticated && user && (
              <div className="pb-4 border-b border-border">
                <p className="font-semibold">{user.nombre} {user.apellidos}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-[#329ACF] capitalize mt-1">Rol: {user.rol}</p>
              </div>
            )}
            
            <Link href="/#" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
              Productos
            </Link>
            <Link href="/#" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
              Servicios
            </Link>
            <Link href="/#" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
              Promociones
            </Link>
            <Link href="/#" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
              Soporte
            </Link>
            <Link href="/#" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
              Nosotros
            </Link>

            {isAuthenticated && user && (
              <>
                <div className="pt-4 border-t border-border space-y-3">
                  <Link href="/perfil" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
                    Mi Perfil
                  </Link>
                  <Link href="/pedidos" className="block text-sm font-medium text-foreground hover:text-[#329ACF]">
                    Mis Compras
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header