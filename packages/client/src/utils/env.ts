// import './envLoad'

// .envの型を定義
const EnvType = {
    NODE_ENV: 'string',
    VOICEVOX_API_URL: 'string',
    A3RT_API_URL: 'string',
    A3RT_API_KEY: 'string',
    KATARAI_API_URL: 'string',
    KATARAI_API_KEY: 'string',
    SOCKET_SERVER: 'string',
    NUM: 'number',
} as const

type EnvKey = keyof typeof EnvType
type Result<T extends EnvKey> = typeof EnvType[T] extends 'string' ? string
    : typeof EnvType[T] extends 'number' ? number : boolean

export const Env = {
    get<T extends EnvKey>(name: T): Result<T> {
        const value = process.env[`REACT_APP_${name}`]
        if (!value) {
            throw Error(`Environment: ${name} is not found.`)
        }
        switch (EnvType[name]) {
            case 'string': {
                return <Result<T>>value
            }
            case 'number': {
                return <Result<T>>Number(value)
            }
            case 'boolean': {
                return <Result<T>>Boolean(value)
            }
            default: {
                throw Error(`Environment: ${name} is unknown type.`)
            }
        }
    },
}
