"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, User, Phone, Building, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { registrarUsuario } from "@/lib/auth"
import { useAuthStore } from "@/store/authStore"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  
  const router = useRouter()
  const { setTempData } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const formData = watch()

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    setPasswordErrors([])

    try {
      // Mapear los datos al formato del backend
      const payload = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }

      const response = await registrarUsuario(payload)

      if (response.success) {
        // Guardar datos temporales para el siguiente paso
        setTempData(data.email, response.data.userId)
        
        // Redirigir a verificación de email
        router.push("/auth/verify-email")
      } else {
        setError(response.message || "Error al registrar usuario")
        if (response.errores) {
          setPasswordErrors(response.errores)
        }
      }
    } catch (err: any) {
      console.error("Error en registro:", err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
        if (err.response.data.errores) {
          setPasswordErrors(err.response.data.errores)
        }
      } else {
        setError("Error al conectar con el servidor. Intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ["nombre", "apellidos"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["email", "telefono"]
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(currentStep + 1)
      setError(null)
    }
  }

  const steps = [
    { number: 1, title: "Información Personal" },
    { number: 2, title: "Datos de Contacto" },
    { number: 3, title: "Seguridad" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-[#54A9D1]/10 via-background to-[#329ACF]/10">
        <div className="container mx-auto max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10">
                <div
                  className="h-full bg-[#329ACF] transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-[#329ACF] text-white scale-110 shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                  </div>
                  <span className="text-xs font-medium text-center hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
              <CardDescription>Completa el formulario para registrarte en Syscom</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Password Errors */}
              {passwordErrors.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre(s)</Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                          <Input
                            id="nombre"
                            placeholder="Juan"
                            {...register("nombre")}
                            className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                            aria-invalid={!!errors.nombre}
                          />
                        </div>
                        {errors.nombre && (
                          <p className="text-sm text-destructive">{errors.nombre.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellido(s)</Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                          <Input
                            id="apellidos"
                            placeholder="Pérez"
                            {...register("apellidos")}
                            className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                            aria-invalid={!!errors.apellidos}
                          />
                        </div>
                        {errors.apellidos && (
                          <p className="text-sm text-destructive">{errors.apellidos.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          {...register("email")}
                          className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                          aria-invalid={!!errors.email}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="+52 123 456 7890"
                          {...register("telefono")}
                          className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                          aria-invalid={!!errors.telefono}
                        />
                      </div>
                      {errors.telefono && (
                        <p className="text-sm text-destructive">{errors.telefono.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Incluye el código de país (ej: +52 para México)
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Security */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password")}
                          className="pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                          aria-invalid={!!errors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Mínimo 8 caracteres, incluye mayúsculas, números y caracteres especiales
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("confirmPassword")}
                          className="pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                          aria-invalid={!!errors.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 h-12 hover:scale-[1.02] transition-all duration-300"
                      disabled={isLoading}
                    >
                      Anterior
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 h-12 bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-[1.02] transition-all duration-300"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creando cuenta...
                        </div>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground pt-4">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/auth/login" className="text-[#329ACF] hover:underline font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}