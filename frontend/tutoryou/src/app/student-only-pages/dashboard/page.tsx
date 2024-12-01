'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function StudentDashboard() {
  const router = useRouter()

  useEffect(() => {
    const profileExists = false

    if (!profileExists) {
      router.push('/student-only-pages/create-profile')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Student Dashboard
      </h1>
      {/* Dashboard content goes here */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="mt-6 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
