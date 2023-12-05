import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

fastify.get('/', async (_request, reply) => {
  reply.type('application/json').code(200);
  return {hello: 'world'};
});

fastify.listen({port: 3000}, (err, _address) => {
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
