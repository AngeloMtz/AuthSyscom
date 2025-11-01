"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/client/header"
import { Footer } from "@/components/client/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { verificarEmail, reenviarCodigo } from "@/lib/auth"
import { useAuthStore } from "@/store/authStore"

export default function VerifyEmailPage() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const router = useRouter()
  const { tempEmail, tempUserId, setTempData } = useAuthStore()

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirigir si no hay email temporal
  useEffect(() => {
    if (!tempEmail) {
      router.push("/auth/register")
    }
  }, [tempEmail, router])

  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return

    const newCodigo = [...codigo]
    newCodigo[index] = value
    setCodigo(newCodigo)

    // Auto-focus al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`codigo-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: ir al input anterior
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      const prevInput = document.getElementById(`codigo-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newCodigo = pastedData.split("").concat(Array(6).fill("")).slice(0, 6)
    setCodigo(newCodigo)

    // Focus al último dígito ingresado o al final
    const lastFilledIndex = Math.min(pastedData.length, 5)
    document.getElementById(`codigo-${lastFilledIndex}`)?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const codigoCompleto = codigo.join("")

    if (codigoCompleto.length !== 6) {
      setError("Por favor ingresa los 6 dígitos del código")
      setIsLoading(false)
      return
    }

    try {
      const response = await verificarEmail(tempEmail!, codigoCompleto)

      if (response.success) {
        setSuccess("¡Email verificado! Ahora verifica tu teléfono.")
        
        // Esperar 1.5 segundos para mostrar el mensaje de éxito
        setTimeout(() => {
          router.push("/auth/verify-phone")
        }, 1500)
      } else {
        setError(response.message || "Código inválido o expirado")
      }
    } catch (err: any) {
      console.error("Error verificando email:", err)
      setError(err.response?.data?.message || "Error al verificar código")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReenviar = async () => {
    if (!canResend || !tempEmail) return

    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await reenviarCodigo(tempEmail, "registro", "email")

      if (response.success) {
        setSuccess("Código reenviado a tu correo electrónico")
        setCanResend(false)
        setCountdown(60)
        setCodigo(["", "", "", "", "", ""]) // Limpiar campos
        document.getElementById("codigo-0")?.focus()
      } else {
        setError(response.message || "Error al reenviar código")
      }
    } catch (err: any) {
      console.error("Error reenviando código:", err)
      setError(err.response?.data?.message || "Error al reenviar código")
    } finally {
      setIsResending(false)
    }
  }

  if (!tempEmail) {
    return null // O un loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-[#54A9D1]/10 via-background to-[#329ACF]/10">
        <div className="container mx-auto max-w-md">
          <Card className="border-none shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#329ACF]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-[#329ACF]" />
              </div>
              <CardTitle className="text-2xl font-bold">Verifica tu Email</CardTitle>
              <CardDescription>
                Hemos enviado un código de 6 dígitos a<br />
                <span className="font-semibold text-foreground">{tempEmail}</span>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-center block">Ingresa el código de verificación</Label>
                  
                  {/* Código inputs */}
                  <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                    {codigo.map((digit, index) => (
                      <Input
                        key={index}
                        id={`codigo-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                        disabled={isLoading || !!success}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-2">
                    El código expira en 10 minutos
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || codigo.some(d => !d) || !!success}
                  className="w-full h-12 bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </div>
                  ) : (
                    "Verificar Email"
                  )}
                </Button>

                {/* Reenviar código */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    ¿No recibiste el código?
                  </p>
                  
                  {canResend ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleReenviar}
                      disabled={isResending}
                      className="text-[#329ACF] hover:text-[#2E78BF] hover:bg-[#329ACF]/10"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reenviar código
                        </>
                      )}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Puedes reenviar el código en {countdown} segundos
                    </p>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground pt-4">
                  ¿Email incorrecto?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/register")}
                    className="text-[#329ACF] hover:underline font-medium"
                  >
                    Volver al registro
                  </button>
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