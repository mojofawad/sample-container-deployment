export default function Loading() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <div className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}