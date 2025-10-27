import "dotenv/config"
import * as joi from "jio"
interface EnvVars {
    SERVER_PORT: number
    NATS_SERVER_URL?: string
}
const envVarsSchema = joi.object<EnvVars>({
    SERVER_PORT: joi.number(),
    NATS_SERVER_URL: joi.string().uri(),
}).unknown(true)
const {error, value} = envVarsSchema.validate(process.env)
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value
export const envs = {
    serverPort: envVars.SERVER_PORT,
    natsServerUrl: envVars.NATS_SERVER_URL,
}
