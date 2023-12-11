import FastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const staticRoot = isDev ? '../dist/public' : 'public';

const fastify = Fastify({
  logger: true
});

fastify.register(FastifyStatic, {
  root: path.join(__dirname, staticRoot),
  prefix: '/'
});

fastify.get('/', async (_request, reply) => {
  return reply.sendFile('index.html');
});

fastify.listen({port: 3000}, err => {
  if (err) throw err;
});

const start = async () => {
  try {
    await fastify.listen({port: 3000});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start().catch(console.error);
