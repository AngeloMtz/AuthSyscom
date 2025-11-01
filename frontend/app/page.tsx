import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { HeroCarousel } from "@/components/client/hero-carousel"
import { ChatbotWidget } from "@/components/client/chatbot-widget"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Laptop, Wrench, ShoppingBag, Headphones, ArrowRight, Star, TrendingUp, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroCarousel />

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#329ACF]/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    <Zap className="h-6 w-6 text-[#329ACF]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Envío Rápido</h3>
                  <p className="text-sm text-muted-foreground">Entrega en 24-48 horas en área metropolitana</p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#329ACF]/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    <Shield className="h-6 w-6 text-[#329ACF]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Garantía Extendida</h3>
                  <p className="text-sm text-muted-foreground">Todos nuestros productos con garantía oficial</p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#329ACF]/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    <Headphones className="h-6 w-6 text-[#329ACF]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Soporte 24/7</h3>
                  <p className="text-sm text-muted-foreground">Atención al cliente siempre disponible</p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#329ACF]/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    <TrendingUp className="h-6 w-6 text-[#329ACF]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Mejores Precios</h3>
                  <p className="text-sm text-muted-foreground">Precios competitivos y promociones constantes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-[#DADDEO]/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorías Principales</h2>
              <p className="text-lg text-muted-foreground">Encuentra todo lo que necesitas para tu negocio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              <Link href="/productos/computadoras" className="group">
                <Card className="hover-lift overflow-hidden border-none shadow-lg h-full transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-[#54A9D1] to-[#329ACF] flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <Laptop className="h-20 w-20 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#329ACF] transition-colors">
                      Computadoras
                    </h3>
                    <p className="text-sm text-muted-foreground">Laptops, desktops y workstations</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/#" className="group">
                <Card className="hover-lift overflow-hidden border-none shadow-lg h-full transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-[#329ACF] to-[#2E78BF] flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <ShoppingBag className="h-20 w-20 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#329ACF] transition-colors">
                      Componentes
                    </h3>
                    <p className="text-sm text-muted-foreground">Hardware y partes de computadora</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/#" className="group">
                <Card className="hover-lift overflow-hidden border-none shadow-lg h-full transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-[#2E78BF] to-[#3857B0] flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <Wrench className="h-20 w-20 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#329ACF] transition-colors">
                      Servicios Técnicos
                    </h3>
                    <p className="text-sm text-muted-foreground">Reparación y mantenimiento</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/#" className="group">
                <Card className="hover-lift overflow-hidden border-none shadow-lg h-full transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-[#3857B0] to-[#329ACF] flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <Headphones className="h-20 w-20 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#329ACF] transition-colors">
                      Periféricos
                    </h3>
                    <p className="text-sm text-muted-foreground">Teclados, mouse, monitores y más</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12 animate-fade-in-up">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Productos Destacados</h2>
                <p className="text-lg text-muted-foreground">Los más vendidos de la semana</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="hover:scale-105 transition-transform duration-300 bg-transparent"
              >
                <Link href="/#">
                  Ver todos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover-lift overflow-hidden border-none shadow-lg group flex flex-col h-full">
                  <div className="aspect-square bg-[#DADDEO]/50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Laptop className="h-24 w-24 text-[#329ACF]/30" />
                    </div>
                    <div className="absolute top-2 right-2 bg-[#329ACF] text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce-in">
                      -20%
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(128)</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-[#329ACF] transition-colors">
                      Laptop Dell Inspiron 15
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 flex-1">Intel Core i7, 16GB RAM, 512GB SSD</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-[#329ACF]">$15,999</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">$19,999</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-105 transition-all duration-300">
                      Agregar al carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-accent text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full animate-float animation-delay-300" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas asesoría personalizada?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para ayudarte a encontrar la solución perfecta para tu negocio
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#329ACF] hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-xl"
            >
              <Link href="/#">
                Contactar a un experto <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <ChatbotWidget />
    </div>
  )
}
