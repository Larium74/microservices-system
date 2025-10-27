import { Value } from "@prisma/client/runtime/library"
import "dotenv/config"
import * as joi from "joi"
interface EnvVars {
  SERVER_PORT: number
  DATABASE_URL: string
  NATS_SERVER_URL: string
}
const envVarsSchema = joi.object<EnvVars>({
  SERVER_PORT: joi.number(),
  DATABASE_URL: joi.string().uri().required(),
  NATS_SERVER_URL: joi.string().uri().required()
}).unknown(true)
const {error, value} = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value
export const envs = {
    server_port: envVars.SERVER_PORT,
    database_url: envVars.DATABASE_URL,
    nats_server_url: envVars.NATS_SERVER_URL
}
