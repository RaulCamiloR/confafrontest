"use client"
import React from 'react'

const Camp = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md p-6 mb-4 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Campaña Saliente 1</h1>
      <button 
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
        onClick={() => console.log('Iniciar campaña')}
      >
        Iniciar Campaña Saliente 1
      </button>
      <div className="text-right mt-4">
        <span className="text-gray-400 font-semibold">Camp</span>
      </div>
    </div>
  )
}

export default Camp