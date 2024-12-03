'use client'
import React, { useState, FormEvent } from 'react'
import { inputClass } from '@/styles/sharedClasses'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [securityQuestion, setSecurityQuestion] = useState<string>('') // State for security question
  const [securityAnswer, setSecurityAnswer] = useState<string>('') // State for security answer
  const [role, setRole] = useState<string>('Learner') // Default role
  const [error, setError] = useState<string | null>(null) // State for error messages
  const [success, setSuccess] = useState<boolean>(false) // State for signup success
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Check for blank fields
    if (
      !username ||
      !password ||
      !role ||
      !securityQuestion ||
      !securityAnswer
    ) {
      setError('All fields are required.')
      return
    }

    // Clear previous error messages
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role,
          security_question: securityQuestion,
          security_answer: securityAnswer,
        }),
      })

      if (res.ok) {
        setSuccess(true) // Indicate success
        setTimeout(() => {
          router.push('/login') // Redirect to login after a brief delay
        }, 2000) // Delay of 2 seconds for user to see the success message
      } else if (res.status === 409) {
        alert('Username is already taken. Please choose another.')
      } else {
        alert('An unexpected error occurred. Please try again.')
      }
    } catch {
      alert('Failed to connect to the server. Please try again later.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sign Up
        </h2>

        {/* Display success message if signup was successful */}
        {success && (
          <p className="text-green-500 text-center mb-4">
            Signup successful! Redirecting to login...
          </p>
        )}

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            >
              <option value="Learner">Learner</option>
              <option value="Tutor">Tutor</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Security Question
            </label>
            <input
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              placeholder="Enter your security question"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Security Answer
            </label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your security answer"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-500 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600"
          >
            Sign Up
          </button>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-indigo-500 dark:text-indigo-400"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
