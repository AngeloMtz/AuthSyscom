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
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Smartphone } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { iniciarSesion } from "@/lib/auth"
import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1) // 1: credenciales, 2: selección de método
  
  const router = useRouter()
  const { setTempData, setTempMetodo } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      metodoVerificacion: "email",
    },
  })

  const metodoVerificacion = watch("metodoVerificacion")
  const emailOrPhone = watch("emailOrPhone")

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await iniciarSesion(data)

      if (response.success) {
        // Guardar datos temporales para el paso de OTP
        setTempData(data.emailOrPhone, response.data.userId)
        setTempMetodo(data.metodoVerificacion)
        
        // Redirigir a verificación OTP
        router.push("/auth/verify-otp-login")
      } else {
        setError(response.message || "Credenciales incorrectas")
      }
    } catch (err: any) {
      console.error("Error en login:", err)
      
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas. Verifica tu email/teléfono y contraseña.")
      } else if (err.response?.status === 403) {
        setError(err.response.data.message || "Tu cuenta está bloqueada o inactiva.")
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Error al conectar con el servidor. Intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#54A9D1]/10 via-background to-[#329ACF]/10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block space-y-6 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#329ACF]/10 text-[#329ACF] text-sm font-medium animate-bounce-in">
                <ShieldCheck className="h-4 w-4" />
                Acceso Seguro con 2FA
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                Bienvenido de vuelta a <span className="text-[#329ACF]">Syscom</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Accede a tu cuenta para gestionar tus pedidos, servicios y disfrutar de ofertas exclusivas.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                { icon: "🛒", title: "Gestiona tus pedidos", desc: "Rastrea y administra todas tus compras" },
                { icon: "⚡", title: "Ofertas exclusivas", desc: "Accede a promociones especiales" },
                { icon: "🔧", title: "Servicios técnicos", desc: "Solicita soporte cuando lo necesites" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-in-left"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login Form */}
          <Card className="border-none shadow-2xl animate-scale-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription>
                {step === 1 
                  ? "Ingresa tus credenciales para acceder a tu cuenta"
                  : "Selecciona cómo quieres recibir el código de verificación"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone">Correo Electrónico o Teléfono</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="tu@email.com o +521234567890"
                      {...register("emailOrPhone")}
                      className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                      aria-invalid={!!errors.emailOrPhone}
                    />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="text-sm text-destructive">{errors.emailOrPhone.message}</p>
                  )}
                </div>

                {/* Password Input */}
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
                </div>

                {/* Método de Verificación */}
                <div className="space-y-3 pt-2">
                  <Label>Método de verificación 2FA</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const event = { target: { name: "metodoVerificacion", value: "email" } }
                        register("metodoVerificacion").onChange(event)
                      }}
                      className={`p-2 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        metodoVerificacion === "email"
                          ? "border-[#329ACF] bg-[#329ACF]/10 shadow-md"
                          : "border-border hover:border-[#329ACF]/50"
                      }`}
                    >
                      <Mail className={`h-6 w-6 ${metodoVerificacion === "email" ? "text-[#329ACF]" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${metodoVerificacion === "email" ? "text-[#329ACF]" : ""}`}>
                        Email
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const event = { target: { name: "metodoVerificacion", value: "sms" } }
                        register("metodoVerificacion").onChange(event)
                      }}
                      className={`p-2 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        metodoVerificacion === "sms"
                          ? "border-[#329ACF] bg-[#329ACF]/10 shadow-md"
                          : "border-border hover:border-[#329ACF]/50"
                      }`}
                    >
                      <Smartphone className={`h-6 w-6 ${metodoVerificacion === "sms" ? "text-[#329ACF]" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${metodoVerificacion === "sms" ? "text-[#329ACF]" : ""}`}>
                        SMS
                      </span>
                    </button>
                  </div>
                  {errors.metodoVerificacion && (
                    <p className="text-sm text-destructive">{errors.metodoVerificacion.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Recibirás un código de verificación por {metodoVerificacion === "email" ? "correo" : "SMS"}
                  </p>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link href="/auth/forgot-password" className="text-sm text-[#329ACF] hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#329ACF] hover:bg-[#2E78BF] text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continuar con 2FA
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-muted-foreground pt-4">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/auth/register" className="text-[#329ACF] hover:underline font-medium">
                    Regístrate aquí
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