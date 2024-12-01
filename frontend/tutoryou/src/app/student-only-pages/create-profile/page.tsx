'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function CreateProfile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile Created:', {
      name,
      email,
      subjects: subjects.join(', '),
      profilePicture,
    })
    router.push('/student-only-pages/dashboard')
  }

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicture(file)
      setPreview(URL.createObjectURL(file)) // Create preview URL
    }
  }

  const handleSubjectChange = (subject: string, isChecked: boolean) => {
    if (isChecked) {
      setSubjects((prev) => [...prev, subject])
    } else {
      setSubjects((prev) => prev.filter((s) => s !== subject))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Create Your Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl space-y-6"
      >
        <div className="flex flex-col items-center">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Profile Picture
          </label>
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-lg text-gray-700 dark:text-gray-300 mb-2">
            Preferred Subjects
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Mathematics',
              'Science',
              'History',
              'Literature',
              'Art',
              'Physical Education',
              'Music',
              'Computer Science',
            ].map((subject) => (
              <label
                key={subject}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={subject}
                  onChange={(e) =>
                    handleSubjectChange(subject, e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {subject}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="mt-6 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
