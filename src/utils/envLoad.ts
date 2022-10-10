import * as path from 'path'
import * as dotenv from 'dotenv'

const isTest = process.env.NODE_ENV === 'test'
const isProd = process.env.NODE_ENV === 'production'
const mode = isTest ? 'test' : isProd ? 'production' : 'development'
const dotenvFiles = [
    '.env',
    mode !== 'test' && `.env.local`,
    `.env.${mode}`,
    `.env.${mode}.local`,
].filter((f): f is string => Boolean(f))

for (const envFile of dotenvFiles) {
    const dotEnvPath = path.resolve(process.cwd(), envFile)

    try {
        dotenv.config({ path: dotEnvPath, override: true })
    } catch (err) {
        console.error(err)
    }
}
