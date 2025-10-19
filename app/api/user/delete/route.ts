import { type NextRequest, NextResponse } from "next/server"
import { deleteUserData } from "@/lib/user-cleanup"
import { getAdminAuth } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * DELETE endpoint to remove a user and all their associated data
 * This will delete: profile, API keys, custom APIs, and usage data
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    // Delete all user data from Firestore
    await deleteUserData(userId)

    // Optionally, delete the user from Firebase Auth
    // Note: This requires proper authentication/authorization
    try {
      const auth = getAdminAuth()
      if (auth) {
        await auth.deleteUser(userId)
      }
    } catch (authError) {
      console.warn('[UserDelete] Could not delete from Firebase Auth:', authError)
      // Continue even if auth deletion fails - Firestore data is already deleted
    }

    return NextResponse.json({ 
      success: true,
      message: "User and all associated data deleted successfully" 
    }, { status: 200 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ 
      error: "Failed to delete user data" 
    }, { status: 500 })
  }
}
