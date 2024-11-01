import { getWeatherData } from '@/lib/api';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
    noStore();

    try {
        console.log("[Page] Starting to fetch weather data", new Date().toISOString());
        const forecasts = await getWeatherData();
        console.log("[Page] Received forecasts:", JSON.stringify(forecasts, null, 2));
        
        const currentTime = new Date().toLocaleTimeString();

        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
                <p className="text-sm text-gray-500 mb-4">Last updated: {currentTime}</p>
                <div className="grid gap-4">
                    {forecasts.map((forecast, index) => (
                        <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
                            <p>Date: {new Date(forecast.date).toLocaleDateString()}</p>
                            <p>Temperature: {forecast.temperatureC}°C / {forecast.temperatureF}°F</p>
                            <p>Summary: {forecast.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("[Page] Error fetching weather data:", error);
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <h1 className="text-2xl font-bold mb-2">Error Loading Weather Data</h1>
                    <p className="text-sm">
                        {error instanceof Error ? error.message : 'Failed to load weather data'}
                    </p>
                </div>
            </div>
        );
    }
}