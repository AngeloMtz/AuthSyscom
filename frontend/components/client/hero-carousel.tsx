"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const slides = [
  {
    id: 1,
    badge: "Oferta Limitada",
    title: "Impresoras Multifuncionales con 20% de Descuento",
    description: "Aprovecha nuestra oferta especial en impresoras de las mejores marcas del mercado.",
    buttonText: "Ver Impresoras",
    buttonLink: "/productos/impresoras",
    image: "/modern-office-printer.jpg",
    tag: "Servicio técnico certificado",
  },
  {
    id: 2,
    badge: "Nuevo",
    title: "Laptops de Última Generación",
    description: "Descubre las laptops más potentes con procesadores Intel Core de 13va generación.",
    buttonText: "Ver Laptops",
    buttonLink: "/productos/laptops",
    image: "/modern-laptop-computer.jpg",
    tag: "Envío gratis",
  },
  {
    id: 3,
    badge: "Promoción",
    title: "Componentes para Gaming",
    description: "Arma tu PC gamer con los mejores componentes a precios increíbles.",
    buttonText: "Ver Componentes",
    buttonLink: "/productos/gaming",
    image: "/gaming-computer-components.jpg",
    tag: "Hasta 12 MSI",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative bg-gradient-to-br from-[#54A9D1] via-[#329ACF] to-[#2E78BF] overflow-hidden h-[500px]">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="relative w-full">
          {/* Slides */}
          <div className="relative overflow-hidden rounded-2xl h-[420px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                  {/* Content */}
                  <div className="text-white space-y-6 p-6 md:p-8 animate-fade-in-up">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold animate-slide-in-left">
                      {slide.badge}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance animate-slide-in-left animation-delay-100">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 text-pretty animate-slide-in-left animation-delay-200">
                      {slide.description}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-[#329ACF] hover:bg-white/90 hover:scale-105 text-lg px-8 shadow-lg transition-all duration-300 animate-slide-in-left animation-delay-300"
                    >
                      <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="relative h-[300px] md:h-[350px] rounded-xl overflow-hidden animate-fade-in-up animation-delay-200">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-in animation-delay-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-foreground">{slide.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110 text-white p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110 text-white p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
