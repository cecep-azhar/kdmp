export const runtime = 'nodejs'
export async function GET() {
  return new Response('Disabled', { status: 404 })
}
