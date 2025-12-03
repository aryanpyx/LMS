import { useRouter } from 'next/router';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Search Results for "{q}"</h1>
      <p className="text-neutral-700">Displaying results for your query. (This page is under construction)</p>
      {/* In a real application, you would fetch and display search results here */}
    </div>
  );
}