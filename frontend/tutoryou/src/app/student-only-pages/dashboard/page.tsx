'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface Tutor {
  name: string
  subject: string
  email: string
  school: string
  availableDates: { date: string; times: string[] }[]
}

interface Appointment {
  tutor?: Tutor
  subject: string
  date: string
  time: string
  status: 'pending' | 'confirmed'
}

interface Profile {
  name: string
  email: string
  subjects: string[]
  profilePicture: string | null
}

export default function StudentDashboard() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    [],
  )
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editProfile, setEditProfile] = useState<Profile | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('profile') || 'null')
    if (!storedProfile) {
      router.push('/student-only-pages/create-profile')
    } else {
      setProfile(storedProfile)
      setEditProfile(storedProfile)
      setPreview(storedProfile.profilePicture)
    }

    const storedPendingAppointments = JSON.parse(
      localStorage.getItem('pendingAppointments') || '[]',
    )
    const storedUpcomingAppointments = JSON.parse(
      localStorage.getItem('upcomingAppointments') || '[]',
    )

    setPendingAppointments(storedPendingAppointments)
    setUpcomingAppointments(storedUpcomingAppointments)
  }, [router])

  const tutors: Tutor[] = [
    {
      name: 'Tutor Name 1',
      subject: 'Mathematics',
      email: 'tutor1@example.com',
      school: 'University of Florida',
      availableDates: [
        { date: '2024-12-04', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
        { date: '2024-12-06', times: ['9:00 AM', '1:00 PM', '3:00 PM'] },
      ],
    },
    {
      name: 'Tutor Name 2',
      subject: 'Science',
      email: 'tutor2@example.com',
      school: 'Stanford University',
      availableDates: [
        { date: '2024-12-04', times: ['9:00 AM', '11:00 AM', '1:00 PM'] },
        { date: '2024-12-05', times: ['10:00 AM', '12:00 PM', '2:00 PM'] },
      ],
    },
  ]

  const handleScheduleAppointment = (
    tutor: Tutor,
    date: string,
    time: string,
  ) => {
    router.push(
      `/student-only-pages/confirm-appointment?tutor=${encodeURIComponent(JSON.stringify(tutor))}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
    )
  }

  const handleRequestAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const date = (e.target as HTMLFormElement).date.value
    const time = (e.target as HTMLFormElement).time.value
    const newAppointment: Appointment = {
      subject: selectedSubject,
      date,
      time,
      status: 'pending',
    }
    const updatedPendingAppointments = [...pendingAppointments, newAppointment]
    setPendingAppointments(updatedPendingAppointments)
    localStorage.setItem(
      'pendingAppointments',
      JSON.stringify(updatedPendingAppointments),
    )
  }

  const handleCancelAppointment = (
    appointment: Appointment,
    type: 'pending' | 'confirmed',
  ) => {
    if (type === 'pending') {
      const updatedPendingAppointments = pendingAppointments.filter(
        (a) => a !== appointment,
      )
      setPendingAppointments(updatedPendingAppointments)
      localStorage.setItem(
        'pendingAppointments',
        JSON.stringify(updatedPendingAppointments),
      )
    } else {
      const updatedUpcomingAppointments = upcomingAppointments.filter(
        (a) => a !== appointment,
      )
      setUpcomingAppointments(updatedUpcomingAppointments)
      localStorage.setItem(
        'upcomingAppointments',
        JSON.stringify(updatedUpcomingAppointments),
      )
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (editProfile) {
      setProfile(editProfile)
      localStorage.setItem('profile', JSON.stringify(editProfile))
      setIsEditing(false)
    }
  }

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, selectedOptions } = e.target
    if (name === 'subjects') {
      const selectedSubjects = Array.from(
        selectedOptions,
        (option) => option.value,
      )
      setEditProfile((prev) =>
        prev ? { ...prev, subjects: selectedSubjects } : null,
      )
    } else {
      setEditProfile((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEditProfile((prev) =>
        prev ? { ...prev, profilePicture: URL.createObjectURL(file) } : null,
      )
      setPreview(URL.createObjectURL(file))
    }
  }

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourInt = parseInt(hour, 10)
    const period = hourInt >= 12 ? 'PM' : 'AM'
    const formattedHour = hourInt % 12 || 12
    return `${formattedHour}:${minute} ${period}`
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  const handleLogout = () => {
    // Clear profile and appointment data
    localStorage.removeItem('profile')
    localStorage.removeItem('pendingAppointments')
    localStorage.removeItem('upcomingAppointments')
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Student Dashboard
      </h1>

      {/* Profile Section */}
      {profile && !isEditing && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Your Profile
          </h2>
          <div className="flex flex-col space-y-4">
            {profile.profilePicture && (
              <div className="flex justify-center mb-4">
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Name:
              </label>
              <p className="text-gray-900 dark:text-gray-200">{profile.name}</p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Email:
              </label>
              <p className="text-gray-900 dark:text-gray-200">
                {profile.email}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Subjects:
              </label>
              <p className="text-gray-900 dark:text-gray-200">
                {profile.subjects.join(', ')}
              </p>
            </div>
            <button
              onClick={handleEditProfile}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        </section>
      )}

      {/* Edit Profile Section */}
      {profile && isEditing && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Edit Profile
          </h2>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              {preview && (
                <div className="mb-4">
                  <Image
                    src={preview}
                    alt="Profile Preview"
                    width={96}
                    height={96}
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
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={editProfile?.name || ''}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={editProfile?.email || ''}
                onChange={handleProfileChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Subjects:
              </label>
              <select
                name="subjects"
                value={editProfile?.subjects || []}
                onChange={handleProfileChange}
                multiple
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              >
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
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Profile
            </button>
          </form>
        </section>
      )}

      {/* Appointment Request Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Schedule an Appointment
        </h2>
        <form className="space-y-4" onSubmit={handleRequestAppointment}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            >
              <option value="" disabled>
                Select a subject
              </option>
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
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Date:
            </label>
            <input
              type="date"
              name="date"
              min={today}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Time:
            </label>
            <input
              type="time"
              name="time"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Request Appointment
          </button>
        </form>
      </section>

      {/* View Tutors Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          View Tutors
        </h2>
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.email}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {tutor.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Subject: {tutor.subject}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Email: {tutor.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                School: {tutor.school}
              </p>
              <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Available Dates and Times:
                </label>
                <div className="space-y-2">
                  {tutor.availableDates.map(({ date, times }) => (
                    <div key={date} className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300">{date}</p>
                      {times.map((time) => (
                        <button
                          key={time}
                          onClick={() =>
                            handleScheduleAppointment(tutor, date, time)
                          }
                          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Appointments Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tutor Pending Appointments
        </h2>
        <div className="space-y-4">
          {pendingAppointments.map((appointment, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Subject: {appointment.subject}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Date: {appointment.date}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Time: {formatTime(appointment.time)}
              </p>
              <button
                onClick={() => handleCancelAppointment(appointment, 'pending')}
                className="mt-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Appointments Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Upcoming Appointments
        </h2>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Tutor: {appointment.tutor?.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Subject: {appointment.subject}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Date: {appointment.date}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Time: {appointment.time}
              </p>
              <button
                onClick={() =>
                  handleCancelAppointment(appointment, 'confirmed')
                }
                className="mt-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="mt-6 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
