'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      router.push('/login')
      return
    }

    try {
      const userData = JSON.parse(user)

      // Redirect based on user role
      if (userData.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else if (userData.role === 'CLIENT') {
        router.push('/client/dashboard')
      } else {
        // Default fallback
        router.push('/client/dashboard')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">🔄</div>
        <p className="text-gray-600">Redirecionando para seu dashboard...</p>
      </div>
    </div>
  )
}
