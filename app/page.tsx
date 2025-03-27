import Camp from '@/components/Camp'
import Planilla from '@/components/Planilla'
import React from 'react'

const HomePage = () => {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">DEMO</h1>
      </div>
      <Camp />
      <Planilla />
    </main>
  )
}

export default HomePage