import { useRouter } from 'next/router';

export default function Messages() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Messages</h1>
      <p className="text-neutral-700">This is the messages page. (Under construction)</p>
      {/* In a real application, you would fetch and display messages here */}
    </div>
  );
}