import axios from 'axios'
import { Env } from './env'

export const voicevoxClient = axios.create({
    baseURL: Env.get('VOICEVOX_API_URL'),
    timeout: 60000,
})