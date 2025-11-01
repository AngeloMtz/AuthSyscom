//footer.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#080C0F] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/images/syscom-logo.png"
              alt="Syscom Logo"
            width={180}
              height={60}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-400 mb-4">
              Servicios y Soluciones en Cómputo. Tu socio tecnológico de confianza desde 1999.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-[#329ACF] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#329ACF] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#329ACF] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#329ACF] transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Catálogo de Productos
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Servicios Técnicos
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Promociones
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-sm text-gray-400 hover:text-[#329ACF] transition-colors">
                  Aviso de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#329ACF] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Av. Insurgentes Sur 1458, Col. Actipan, Benito Juárez, CDMX
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#329ACF] flex-shrink-0" />
                <span className="text-sm text-gray-400">800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#329ACF] flex-shrink-0" />
                <span className="text-sm text-gray-400">contacto@syscom.mx</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 Syscom. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
