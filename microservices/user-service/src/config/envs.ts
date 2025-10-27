import "dotenv/config"
import * as joi from "joi"
import { ValueFromArray } from "rxjs"
interface EnvVars {
    SERVER_PORT: number
    DATABASE_URL: string
    NATS_SERVER_URL: string
    JWT_SECRET: string
}
const envVarsSchema = joi.object<EnvVars>({
    SERVER_PORT: joi.number(),
    DATABASE_URL: joi.string().uri().required(),
    NATS_SERVER_URL: joi.string().uri().required(),
    JWT_SECRET: joi.string().required(),
}).unknown(true)
const {error, value} = envVarsSchema.validate(process.env)
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value
export const envs = {
    serverPort: envVars.SERVER_PORT,
    databaseUrl: envVars.DATABASE_URL,
    natsServerUrl: envVars.NATS_SERVER_URL,
    jwtSecret: envVars.JWT_SECRET,
}
