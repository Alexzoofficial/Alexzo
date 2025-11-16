
import { NextResponse } from 'next/server'
import { admin } from '@/lib/firebase/admin'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { keyId } = await request.json()
    const headersList = headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 })
    }

    const keyDocRef = admin.firestore().collection('apiKeys').doc(keyId)
    const keyDoc = await keyDocRef.get()

    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    // Optional: Verify ownership before deleting
    if (keyDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    await keyDocRef.delete()

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
