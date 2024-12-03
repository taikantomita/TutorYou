'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConfirmAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tutor = JSON.parse(
    decodeURIComponent(searchParams.get('tutor') || '{}'),
  )
  const date = decodeURIComponent(searchParams.get('date') || '')
  const time = decodeURIComponent(searchParams.get('time') || '')

  const handleConfirm = () => {
    const upcomingAppointments = JSON.parse(
      localStorage.getItem('upcomingAppointments') || '[]',
    )

    const newAppointment = {
      tutor,
      subject: tutor.subject,
      date,
      time,
      status: 'confirmed',
    }

    upcomingAppointments.push(newAppointment)
    localStorage.setItem(
      'upcomingAppointments',
      JSON.stringify(upcomingAppointments),
    )

    console.log('Appointment confirmed with:', tutor, 'on', date, 'at', time)
    router.push('/student-only-pages/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Confirm Appointment
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
        <p className="text-gray-700 dark:text-gray-300">
          You have selected an appointment with:
        </p>
        <p className="text-gray-900 dark:text-gray-200">Tutor: {tutor.name}</p>
        <p className="text-gray-900 dark:text-gray-200">
          Subject: {tutor.subject}
        </p>
        <p className="text-gray-900 dark:text-gray-200">
          School: {tutor.school}
        </p>
        <p className="text-gray-900 dark:text-gray-200">Email: {tutor.email}</p>
        <p className="text-gray-900 dark:text-gray-200">Date: {date}</p>
        <p className="text-gray-900 dark:text-gray-200">Time: {time}</p>
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  )
}
