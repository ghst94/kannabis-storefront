import { Footer, Header } from "@/components/organisms"
import { AgeGate } from "@/components/organisms/AgeGate/AgeGate"
import { retrieveCustomer } from "@/lib/data/customer"
import { checkRegion } from "@/lib/helpers/check-region"
import { Session } from "@talkjs/react"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID
  const { locale } = await params

  const user = await retrieveCustomer()
  const regionCheck = await checkRegion(locale)

  if (!regionCheck) {
    return redirect("/")
  }

  if (!APP_ID || !user)
    return (
      <>
        <AgeGate />
        <Header />
        {children}
        <Footer />
      </>
    )

  return (
    <>
      <AgeGate />
      <Session appId={APP_ID} userId={user.id}>
        <Header />
        {children}
        <Footer />
      </Session>
    </>
  )
}
