/**
 * Gallery Page
 * Public page for gallery
 */

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold mb-4">School Gallery</h2>
          <p className="text-gray-600">Gallery images will be displayed here.</p>
        </div>
      </main>
    </div>
  );
}
