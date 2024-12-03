'use client'
import React, { useState, FormEvent } from 'react'
import { inputClass } from '@/styles/sharedClasses'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [username, setUsername] = useState<string>('')
  const [securityAnswer, setSecurityAnswer] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const router = useRouter()

  const handleFetchSecurityQuestion = async () => {
    setError(null)
    setSecurityQuestion(null)

    const res = await fetch(
      `http://localhost:8000/security-question?username=${username}`,
    )
    if (res.ok) {
      const data = await res.json()
      setSecurityQuestion(data.security_question)
    } else {
      setError('User not found.')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Check for blank fields
    if (!username || !securityAnswer || !newPassword) {
      setError('All fields are required.')
      return
    }

    // Clear previous error messages
    setError(null)

    const res = await fetch('http://localhost:8000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        security_answer: securityAnswer,
        new_password: newPassword,
      }),
    })

    if (res.ok) {
      setSuccess(true) // Indicate success
      setTimeout(() => {
        router.push('/login') // Redirect to login after a brief delay
      }, 2000) // Delay of 2 seconds for user to see the success message
    } else {
      setError('Invalid security answer or an unexpected error occurred.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Reset Password
        </h2>

        {/* Display success message if password reset was successful */}
        {success && (
          <p className="text-green-500 text-center mb-4">
            Password reset successful! Redirecting to login...
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
            <button
              type="button"
              onClick={handleFetchSecurityQuestion}
              className="mt-2 w-full py-2 text-white bg-indigo-500 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600"
            >
              Fetch Security Question
            </button>
          </div>
          {securityQuestion && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  Security Question
                </label>
                <p className="text-gray-900 dark:text-gray-200">
                  {securityQuestion}
                </p>
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-indigo-500 dark:bg-indigo-600 rounded-lg hover:bg-indigo-600"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
