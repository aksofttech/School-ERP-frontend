/**
 * About Page
 * Public page for about
 */

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">About</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold mb-4">About School ERP</h2>
          <p className="text-gray-600">This is a comprehensive school management system.</p>
        </div>
      </main>
    </div>
  );
}
