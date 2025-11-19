import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data

    try {
      // Create or update customer in Medusa
      const medusaResponse = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/store/customers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            email: email_addresses[0]?.email_address,
            first_name: first_name || '',
            last_name: last_name || '',
            phone: phone_numbers[0]?.phone_number || '',
            metadata: {
              clerk_user_id: id,
            },
          }),
        }
      )

      if (!medusaResponse.ok) {
        const error = await medusaResponse.text()
        console.error('Medusa API error:', error)
      } else {
        console.log(`Successfully synced user ${id} to Medusa`)
      }
    } catch (error) {
      console.error('Error syncing to Medusa:', error)
      return new Response('Error syncing to Medusa', { status: 500 })
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}
