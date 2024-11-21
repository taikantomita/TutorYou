'use client'
import React from 'react'
import { signOut } from 'next-auth/react'

export default function TutorDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          This page should only be visible when logged as a tutor. <br />
          The code for this page is in
          TutorYou/frontend/tutoryou/src/app/tutor-only-pages/tutor-dashboard/page.tsx
        </h1>

        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-6 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}