import https from 'node:https';
import http from 'node:http';
import fetch from 'node-fetch';

// Match the exact shape from your .NET API
interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

// Create a type guard to validate the response
function isWeatherForecastArray(data: unknown): data is WeatherForecast[] {
    if (!Array.isArray(data)) return false;

    return data.every(item =>
        typeof item === 'object' &&
        item !== null &&
        'date' in item &&
        'temperatureC' in item &&
        'temperatureF' in item &&
        'summary' in item
    );
}

export async function getWeatherData(): Promise<WeatherForecast[]> {
    const apiUrl = process.env.services__api__https__0;
    console.log('API URL:', apiUrl);

    if (!apiUrl) {
        console.log('Available env vars:', process.env);
        throw new Error('API URL not configured');
    }

    const url = `${apiUrl}/weatherforecast`;
    console.log('Fetching from:', url);

    try {
        const useHttps = url.startsWith('https');
        const agent = useHttps
            ? new https.Agent({ rejectUnauthorized: false })
            : new http.Agent();

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            agent
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Validate the response data
        if (!isWeatherForecastArray(data)) {
            console.error('Invalid response data:', data);
            throw new Error('Invalid response format from API');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}