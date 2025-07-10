"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Award } from 'lucide-react'

export default function IrecCertificatePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new IREC certificates page
    router.push('/irec-certificates')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Award className="h-8 w-8 text-white" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <h2 className="text-xl font-medium text-gray-100">Redirecting to IREC Certificates...</h2>
        <p className="text-sm text-gray-500">Please wait while we redirect you to the new page</p>
      </div>
    </div>
  )
}