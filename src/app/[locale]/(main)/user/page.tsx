import { LoginForm } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"

export default async function UserPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await retrieveCustomer()

  if (!user) return <LoginForm />

  // Redirect to dashboard
  redirect(`/${locale}/user/dashboard`)
}
