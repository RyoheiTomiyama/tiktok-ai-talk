import { a3rtClient } from "@/utils/axios"
import { Env } from "@/utils/env"

interface IA3rt {
    smalltalk(text: string): Promise<object>
}

export default class A3rt implements IA3rt {
    async smalltalk(text: string = 'こんにちは'): Promise<object> {
        const result = await a3rtClient.post('/talk/v1/smalltalk', {
            query: text,
            apikey: Env.get('A3RT_API_KEY'),
        })
        console.log(result.data)
        return result.data
    }
}
