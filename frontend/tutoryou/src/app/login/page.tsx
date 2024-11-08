'use client'
import React from 'react'
import { signIn } from 'next-auth/react'
import { useState, FormEvent } from 'react'
import { inputClass } from '@/styles/sharedClasses'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
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

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (result?.ok) {
      router.push('/user-landing')
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

        {/* Display error message if login fails */}
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
        </form>
      </div>
    </div>
  )
}
