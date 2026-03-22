import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { Button } from "../../../shared/ui/Button"
import { FormField } from "../../../shared/ui/FormField"
import { TextInput } from "../../../shared/ui/TextInput"
import { setAuth } from "../../../shared/lib/auth"
import { useLoginMutation } from "../api/authApi"
import { adminLoginSchema, type AdminLoginValues } from "../model/adminLoginSchema"

export function AdminLoginForm() {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState("")
  const [login] = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: AdminLoginValues) => {
    setLoginError("")

    try {
      const response = await login(values).unwrap()

      if (response.data === true) {
        setAuth(response.token)
        navigate("/admin/dashboard")
        return
      }

      setLoginError("Неверный email или пароль.")
    } catch {
      setLoginError("Не удалось выполнить вход. Попробуйте позже.")
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Email" error={errors.email?.message} required>
        <TextInput type="email" placeholder="admin@example.com" autoComplete="username" {...register("email")} />
      </FormField>

      <FormField label="Пароль" error={errors.password?.message} required>
        <TextInput
          type="password"
          placeholder="passwordsecret"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Идет загрузка..." : "Войти"}
      </Button>

      {loginError ? <div className="form-submit-error">{loginError}</div> : null}
    </form>
  )
}
