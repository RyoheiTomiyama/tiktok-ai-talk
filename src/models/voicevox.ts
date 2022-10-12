import { voicevoxClient } from "@/utils/axios"

interface IVoicevox {
    audioQuery(text: string): Promise<object>
    synthesis(query: object): Promise<object>
}

export default class Voicevox implements IVoicevox {
    async audioQuery(text: string = 'こんにちは'): Promise<object> {
        const audioQueryResult = await voicevoxClient.post('/audio_query', {}, { params: {
            speaker: 2,
            text,
        }})
        return audioQueryResult.data
    }

    async synthesis(query: object): Promise<object> {
        const synthesisResult = await voicevoxClient.post(
            '/synthesis',
            query,
            {
                params: {
                    speaker:  2,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            }
        )
        return synthesisResult.data
    }
}
