'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Appointment {
  studentName: string
  subject: string
  date: string
  time: string
  status: 'pending' | 'confirmed'
}

export default function ReviewRequest() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [studentName, setStudentName] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    if (searchParams) {
      const studentNameParam = searchParams.get('studentName')
      const subjectParam = searchParams.get('subject')
      const dateParam = searchParams.get('date')
      const timeParam = searchParams.get('time')

      if (studentNameParam) {
        setStudentName(decodeURIComponent(studentNameParam))
      }
      if (subjectParam) {
        setSubject(decodeURIComponent(subjectParam))
      }
      if (dateParam) {
        setDate(decodeURIComponent(dateParam))
      }
      if (timeParam) {
        setTime(decodeURIComponent(timeParam))
      }
    }
  }, [searchParams])

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourInt = parseInt(hour, 10)
    const period = hourInt >= 12 ? 'PM' : 'AM'
    const formattedHour = hourInt % 12 || 12
    return `${formattedHour}:${minute} ${period}`
  }

  const handleConfirm = () => {
    const upcomingAppointments = JSON.parse(
      localStorage.getItem('upcomingAppointments') || '[]',
    )

    const newAppointment: Appointment = {
      studentName,
      subject,
      date,
      time,
      status: 'confirmed',
    }

    upcomingAppointments.push(newAppointment)
    localStorage.setItem(
      'upcomingAppointments',
      JSON.stringify(upcomingAppointments),
    )

    const pendingAppointments = JSON.parse(
      localStorage.getItem('pendingAppointments') || '[]',
    ).filter(
      (appointment: Appointment) =>
        appointment.studentName !== studentName ||
        appointment.subject !== subject ||
        appointment.date !== date ||
        appointment.time !== time,
    )
    localStorage.setItem(
      'pendingAppointments',
      JSON.stringify(pendingAppointments),
    )

    console.log(
      'Appointment confirmed for:',
      studentName,
      subject,
      'on',
      date,
      'at',
      time,
    )
    router.push('/tutor-only-pages/dashboard')
  }

  if (!studentName || !subject || !date || !time) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Review Tutoring Request
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
        <p className="text-gray-700 dark:text-gray-300">
          You have received a tutoring request from {studentName} for:
        </p>
        <p className="text-gray-900 dark:text-gray-200">Subject: {subject}</p>
        <p className="text-gray-900 dark:text-gray-200">Date: {date}</p>
        <p className="text-gray-900 dark:text-gray-200">
          Time: {formatTime(time)}
        </p>
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Accept Request
        </button>
      </div>
    </div>
  )
}
