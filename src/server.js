// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const Hapi = require('@hapi/hapi');

// Notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// Users
const users = require('./api/users');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/users');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UserService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response.isBoom) {
      console.log(response);
    }

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
