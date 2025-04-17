import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-red-600">404 - Page Not Found</h2>
      <p className="mt-4">Sorry, the page you’re looking for doesn’t exist.</p>
      <h2 className="text-2xl font-bold text-blue-600"><Link href="/">Return Home</Link></h2>
    </div>
  );
}
