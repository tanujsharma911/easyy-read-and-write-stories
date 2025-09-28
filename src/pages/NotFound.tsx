
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className=" flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50"
          >
            Go back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </main>
  );
}
