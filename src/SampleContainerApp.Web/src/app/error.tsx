'use client';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
            <p className="text-red-500 mb-4">{error.message}</p>
            <button
                onClick={reset}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Try again
            </button>
        </div>
    );
}