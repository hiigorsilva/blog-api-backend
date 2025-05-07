import { ajvFilePlugin } from '@fastify/multipart'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './app/error-handler'
import { registerCors } from './app/plugins/cors'
import { registerMultipart } from './app/plugins/multipart'
import { registerSwagger } from './app/plugins/swagger'
import { registerRoutes } from './routes'
import { env } from './schema/env'

export const app = fastify({
  ajv: {
    plugins: [ajvFilePlugin],
  },
}).withTypeProvider<ZodTypeProvider>()

// Configurações básicas
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registra plugins e módulos
registerCors(app)
registerSwagger(app)
registerMultipart(app)

registerRoutes(app)

// Configura tratamento de erros
app.setErrorHandler(errorHandler)

app.addHook('onReady', () => {
  app.log.info('Server is ready')
  console.log('➡️  Server is ready')
})

// Inicia o servidor
const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    })

    console.log(`✅ Server running on port ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
