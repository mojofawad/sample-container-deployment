import https from 'node:https';
import http from 'node:http';
import fetch, { RequestInit } from 'node-fetch';
import { URL } from 'url';

interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

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
    // Try both HTTPS and HTTP environment variables
    const apiUrl = process.env.services__api__https__0 || process.env.services__api__http__0;

    if (!apiUrl) {
        console.log('Available env vars:', process.env);
        throw new Error('No API URL configured in environment variables');
    }

    console.log('API URL:', apiUrl);

    try {
        // Parse the URL to determine the protocol
        const parsedUrl = new URL(`${apiUrl}/weatherforecast`);
        console.log('Fetching from:', parsedUrl.toString());

        const fetchOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Configure the appropriate agent based on protocol
        if (parsedUrl.protocol === 'https:') {
            fetchOptions.agent = new https.Agent({
                rejectUnauthorized: false // Only use in development
            });
        } else if (parsedUrl.protocol === 'http:') {
            fetchOptions.agent = new http.Agent();
        }

        const response = await fetch(parsedUrl.toString(), fetchOptions);

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (!isWeatherForecastArray(data)) {
            console.error('Invalid response data:', data);
            throw new Error('Invalid response format from API');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

// Optional: Helper function to test the connection
export async function testApiConnection(): Promise<boolean> {
    try {
        await getWeatherData();
        return true;
    } catch (error) {
        console.error('Connection test failed:', error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}