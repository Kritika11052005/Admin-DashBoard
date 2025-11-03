export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">404 - Not Found</h2>
        <p className="text-zinc-400">Could not find requested resource</p>
        <a href="/dashboard" className="text-yellow-400 hover:text-yellow-300 mt-4 inline-block">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}