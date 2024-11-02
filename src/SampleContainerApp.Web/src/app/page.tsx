import {getWeatherData} from '@/lib/api';
import {unstable_noStore as noStore} from 'next/cache';
import {Cloud, Sun, Thermometer, Clock, Calendar, CloudRain} from 'lucide-react';

interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

type WeatherSummary = 'warm' | 'mild' | 'balmy' | 'scorching' | string;

const getWeatherIcon = (summary: WeatherSummary) => {
    const lowercaseSummary = summary.toLowerCase();
    switch (lowercaseSummary) {
        case 'warm':
            return <Sun className="w-6 h-6 text-weather-warm"/>;
        case 'mild':
            return <Sun className="w-6 h-6 text-weather-mild"/>;
        case 'balmy':
            return <CloudRain className="w-6 h-6 text-weather-balmy"/>;
        case 'scorching':
            return <Thermometer className="w-6 h-6 text-weather-scorching"/>;
        default:
            return <Cloud className="w-6 h-6 text-gray-400"/>;
    }
};

export default async function Home() {
    noStore();

    try {
        console.log("[Page] Starting to fetch weather data", new Date().toISOString());
        const forecasts: WeatherForecast[] = await getWeatherData();
        console.log("[Page] Received forecasts:", JSON.stringify(forecasts, null, 2));

        const currentTime: string = new Date().toLocaleTimeString();

        return (
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 animate-slide-up">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
                            Weather Forecast
                        </h1>
                        <div
                            className="flex items-center text-gray-500 space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                            <Clock className="w-4 h-4"/>
                            <p className="text-sm font-medium">Last updated: {currentTime}</p>
                        </div>
                    </div>

                    {/* Forecast Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {forecasts.map((forecast: WeatherForecast, index: number) => (
                            <div
                                key={index}
                                className="animate-slide-up bg-white rounded-2xl shadow-card 
                                         hover:shadow-card-hover transition-all duration-300 
                                         transform hover:-translate-y-1"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400"/>
                                            <p className="text-gray-600 font-medium">
                                                {new Date(forecast.date).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="p-2 rounded-full bg-gray-50">
                                            {getWeatherIcon(forecast.summary)}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Thermometer className="w-5 h-5 text-weather-scorching"/>
                                            <div className="flex items-center space-x-4">
                                                <p className="text-weather-temp font-bold text-gray-800">
                                                    {forecast.temperatureC}°
                                                    <span className="text-sm font-normal text-gray-500">C</span>
                                                </p>
                                                <span className="text-gray-300">|</span>
                                                <p className="text-lg text-gray-600">
                                                    {forecast.temperatureF}°
                                                    <span className="text-sm font-normal text-gray-500">F</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <p className="text-gray-600 font-medium px-3 py-1 bg-gray-50 rounded-full">
                                                {forecast.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error("[Page] Error fetching weather data:", error);
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-8 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border-l-4 border-red-500 rounded-2xl shadow-card p-6
                                  transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 p-2 bg-red-50 rounded-full">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Error Loading Weather Data</h1>
                                <p className="mt-2 text-gray-600">
                                    {error instanceof Error ? error.message : 'Failed to load weather data'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}