'use client'
import React, { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { inputClass } from '@/styles/sharedClasses'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) // State for error message
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    // Check for blank fields
    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    // Clear any previous error
    setError(null)

    // Perform login using NextAuth
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (result?.ok) {
      // Fetch session data after successful login
      const res = await fetch('/api/auth/session')
      const session = await res.json()

      if (session?.user?.role === 'Tutor') {
        router.push('/tutor-only-pages/dashboard') // Redirect tutors to their dashboard
      } else if (session?.user?.role === 'Learner') {
        router.push('/student-only-pages/dashboard') // Redirect learners to their dashboard
      } else {
        router.push('/user-landing') // Fallback route if role is undefined
      }
    } else {
      // Set a user-friendly error message
      setError(
        'Login failed. Please check your username and password and try again.',
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-500 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-indigo-500 dark:text-indigo-400">
              Sign up
            </a>
          </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Forgot your password?{' '}
            <a
              href="/reset-password"
              className="text-indigo-500 dark:text-indigo-400"
            >
              Reset Password
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
