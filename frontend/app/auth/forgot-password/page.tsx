//forgot-password/page.tsx

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
import { Mail, ArrowLeft, KeyRound, Smartphone, AlertCircle, CheckCircle2 } from "lucide-react"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations"
import { solicitarRecuperacion } from "@/lib/auth"
import { useAuthStore } from "@/store/authStore"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const { setTempData, setTempMetodo } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      metodoVerificacion: "email",
    },
  })

  const metodoVerificacion = watch("metodoVerificacion")
  const emailOrPhone = watch("emailOrPhone")

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await solicitarRecuperacion(data)

      if (response.success) {
        setSuccess(`Código enviado a tu ${data.metodoVerificacion === "email" ? "correo" : "teléfono"}`)
        setCodeSent(true)
        
        // Guardar datos temporales para el siguiente paso
        setTempData(data.emailOrPhone, 0) // userId no es necesario aquí
        setTempMetodo(data.metodoVerificacion)
        
        // Redirigir a página de verificación de código
        setTimeout(() => {
          router.push("/auth/verify-reset-code")
        }, 2000)
      } else {
        setError(response.message || "Error al enviar código")
      }
    } catch (err: any) {
      console.error("Error solicitando recuperación:", err)
      setError(err.response?.data?.message || "Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#54A9D1]/10 via-background to-[#329ACF]/10">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-2xl animate-scale-in">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#329ACF]/10 flex items-center justify-center mb-4 animate-bounce-in">
                <KeyRound className="h-8 w-8 text-[#329ACF]" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {codeSent ? "Código Enviado" : "Recuperar Contraseña"}
              </CardTitle>
              <CardDescription>
                {codeSent
                  ? `Hemos enviado un código de verificación a tu ${metodoVerificacion === "email" ? "correo" : "teléfono"}`
                  : "Ingresa tu correo electrónico o teléfono para recuperar tu contraseña"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Success Alert */}
              {success && (
                <Alert className="mb-6 border-green-500 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!codeSent ? (
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

                  {/* Método de Verificación */}
                  <div className="space-y-3">
                    <Label>¿Cómo quieres recibir el código?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const event = { target: { name: "metodoVerificacion", value: "email" } }
                          register("metodoVerificacion").onChange(event)
                        }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
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
                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
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
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-[1.02] transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando código...
                      </div>
                    ) : (
                      "Enviar Código de Recuperación"
                    )}
                  </Button>

                  <Button type="button" variant="ghost" className="w-full" asChild>
                    <Link href="/auth/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al inicio de sesión
                    </Link>
                  </Button>
                </form>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Hemos enviado un código de 6 dígitos por {metodoVerificacion === "email" ? "correo electrónico" : "SMS"} a:
                      </p>
                      <p className="font-semibold text-[#329ACF]">{emailOrPhone}</p>
                    </div>
                    <div className="p-4 bg-[#329ACF]/10 rounded-lg text-sm text-left space-y-2">
                      <p className="font-medium">Próximos pasos:</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Revisa tu {metodoVerificacion === "email" ? "bandeja de entrada" : "mensajes SMS"}</li>
                        <li>Copia el código de 6 dígitos</li>
                        <li>Ingresa el código y tu nueva contraseña</li>
                      </ol>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Serás redirigido automáticamente...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}