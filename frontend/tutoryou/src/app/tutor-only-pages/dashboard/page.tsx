'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Handles navigation
import { signOut } from 'next-auth/react' // Handles sign out
import Image from 'next/image' // Image handling

// Handler for tutor user
interface Tutor {
  name: string
  subject: string
  email: string
  school: string
  availableDates: { date: string; times: string[] }[]
}

// Handler for appointment 
interface Appointment {
  tutor?: Tutor
  studentName: string
  subject: string
  date: string
  time: string
  status: 'pending' | 'confirmed'
}

// Handler for profile
interface Profile {
  name: string
  email: string
  subjects: string[]
  profilePicture: string | null
}

// 
export default function TutorDashboard() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableDates, setAvailableDates] = useState<
    { date: string; times: string[] }[]
  >([])
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    [
      {
        studentName: 'Test Student 1',
        subject: 'Mathematics',
        date: '2024-12-04',
        time: '10:00',
        status: 'pending',
      },
      {
        studentName: 'Test Student 2',
        subject: 'Science',
        date: '2024-12-05',
        time: '11:00',
        status: 'pending',
      },
    ],
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
      router.push('/tutor-only-pages/create-profile')
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

    setPendingAppointments((prev) => [...prev, ...storedPendingAppointments])
    setUpcomingAppointments(storedUpcomingAppointments)
  }, [router])

  const handleAddTimeslot = (e: React.FormEvent) => {
    e.preventDefault()
    const newAvailableDates = [...availableDates]
    const dateIndex = newAvailableDates.findIndex(
      (d) => d.date === selectedDate,
    )
    if (dateIndex > -1) {
      newAvailableDates[dateIndex].times.push(selectedTime)
    } else {
      newAvailableDates.push({ date: selectedDate, times: [selectedTime] })
    }
    setAvailableDates(newAvailableDates)
    setSelectedDate('')
    setSelectedTime('')
  }

  const handleReviewRequest = (appointment: Appointment) => {
    router.push(
      `/tutor-only-pages/review-request?studentName=${encodeURIComponent(appointment.studentName)}&subject=${encodeURIComponent(appointment.subject)}&date=${encodeURIComponent(appointment.date)}&time=${encodeURIComponent(appointment.time)}`,
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
    const { name, value } = e.target
    if (name === 'subjects' && e.target instanceof HTMLSelectElement) {
      const selectedSubjects = Array.from(
        e.target.selectedOptions,
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

  const today = new Date().toISOString().split('T')[0]

  const handleLogout = () => {
    localStorage.removeItem('profile')
    localStorage.removeItem('pendingAppointments')
    localStorage.removeItem('upcomingAppointments')
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Tutor Dashboard
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

      {/* Add Timeslot Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Add Available Timeslot
        </h2>
        <form className="space-y-4" onSubmit={handleAddTimeslot}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Time:
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Timeslot
          </button>
        </form>
      </section>

      {/* View Available Timeslots Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Your Available Timeslots
        </h2>
        <div className="space-y-4">
          {availableDates.map(({ date, times }) => (
            <div
              key={date}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-700 dark:text-gray-300">{date}</p>
              {times.map((time) => (
                <p key={time} className="text-gray-700 dark:text-gray-300">
                  {formatTime(time)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Pending Appointments Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Pending Tutoring Requests
        </h2>
        <div className="space-y-4">
          {pendingAppointments.map((appointment, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Student: {appointment.studentName}
              </p>
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
                onClick={() => handleReviewRequest(appointment)}
                className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Review
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
                Student: {appointment.studentName}
              </p>
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
