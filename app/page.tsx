'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center text-blue-900 mb-8">
          PenPal Connect
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12">
          Connecting K-12 students with MSU mentors through letters
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Students</h2>
            <p className="text-gray-600 mb-4">
              Get matched with an MSU mentor and start writing letters!
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Student Login
            </button>
          </div>

          {/* Parent Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Parents</h2>
            <p className="text-gray-600 mb-4">
              Approve your child's enrollment and monitor their progress.
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Parent Login
            </button>
          </div>

          {/* Mentor Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Mentors</h2>
            <p className="text-gray-600 mb-4">
              MSU students: mentor a K-12 student through letter writing.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Mentor Login
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-bold text-blue-600">1.</span> Students enroll through their school
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-bold text-green-600">2.</span> Parents approve enrollment
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-bold text-purple-600">3.</span> Get matched with a mentor
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-bold text-orange-600">4.</span> Write letters and grow your garden! 🌱
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}