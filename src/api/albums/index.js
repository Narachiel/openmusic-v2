const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service,
    userAlbumLikesService,
    validator,
  }) => {
    const albumsHandler = new AlbumsHandler(service, userAlbumLikesService, validator);
    server.route(routes(albumsHandler));
  },
};
