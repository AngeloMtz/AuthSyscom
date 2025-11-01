//new-password/page.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound } from "lucide-react"
import { z } from "zod"
import { resetearPassword } from "@/lib/auth"
import { useAuthStore } from "@/store/authStore"

// Schema solo para la nueva contraseña (sin código)
const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type NewPasswordFormData = z.infer<typeof newPasswordSchema>

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  
  const router = useRouter()
  const { tempEmail, clearTempData } = useAuthStore()

  // Redirigir si no hay email temporal
  useEffect(() => {
    if (!tempEmail) {
      router.push("/auth/forgot-password")
    }
  }, [tempEmail, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  })

 const onSubmit = async (data: NewPasswordFormData) => {
  setIsLoading(true)
  setError(null)
  setSuccess(null)
  setPasswordErrors([])

  try {
    // Llamar con solo email y nueva contraseña
    const response = await resetearPassword(tempEmail!, data.newPassword)

    if (response.success) {
      setSuccess("¡Contraseña actualizada exitosamente!")
      clearTempData()
      
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } else {
      setError(response.message || "Error al actualizar contraseña")
      if (response.errores) {
        setPasswordErrors(response.errores)
      }
    }
  } catch (err: any) {
    console.error("Error actualizando contraseña:", err)
    if (err.response?.data?.message) {
      setError(err.response.data.message)
      if (err.response.data.errores) {
        setPasswordErrors(err.response.data.errores)
      }
    } else {
      setError("Error al conectar con el servidor")
    }
  } finally {
    setIsLoading(false)
  }
}

  if (!tempEmail) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-[#54A9D1]/10 via-background to-[#329ACF]/10">
        <div className="container mx-auto max-w-md">
          <Card className="border-none shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#329ACF]/10 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-[#329ACF]" />
              </div>
              <CardTitle className="text-2xl font-bold">Crear Nueva Contraseña</CardTitle>
              <CardDescription>
                Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
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
                {/* Nueva Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("newPassword")}
                      className="pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                      aria-invalid={!!errors.newPassword}
                      disabled={isLoading || !!success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, incluye mayúsculas, números y caracteres especiales
                  </p>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#329ACF]" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="pl-10 pr-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-[#329ACF]/20 focus:border-[#329ACF]"
                      aria-invalid={!!errors.confirmPassword}
                      disabled={isLoading || !!success}
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

                <Button
                  type="submit"
                  disabled={isLoading || !!success}
                  className="w-full h-12 bg-[#329ACF] hover:bg-[#2E78BF] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Actualizando...
                    </div>
                  ) : success ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Contraseña Actualizada
                    </div>
                  ) : (
                    "Restablecer Contraseña"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-4">
                  ¿Recordaste tu contraseña?{" "}
                  <Link href="/auth/login" className="text-[#329ACF] hover:underline font-medium">
                    Iniciar sesión
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