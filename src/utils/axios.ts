import axios from 'axios'
import { Env } from './env'

export const voicevoxClient = axios.create({
    baseURL: Env.get('VOICEVOX_API_URL'),
    timeout: 10000,
})

export const a3rtClient = axios.create({
    baseURL: Env.get('A3RT_API_URL'),
    timeout: 10000,
    headers: {
        // CORS-error対策 https://zenn.dev/httky/articles/2813c111141a47
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})
a3rtClient.interceptors.request.use((config) => {
    if (config.method === 'POST') {
        config.data.apikey = Env.get('A3RT_API_KEY')
    }
    return config
})