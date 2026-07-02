/**
 * Home Page
 * Public page for home
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">School ERP System</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to School ERP</h2>
          <p className="text-xl text-gray-600 mb-8">Comprehensive School Management System</p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Login
            </Link>
            <Link href="/public/about" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
