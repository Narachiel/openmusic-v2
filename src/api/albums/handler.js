const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, userAlbumLikesService, validator) {
    this._service = service;
    this._userAlbumLikesService = userAlbumLikesService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postUserAlbumLikeHandler = this.postUserAlbumLikeHandler.bind(this);
    this.getUserAlbumLikeByAlbumIdHandler = this.getUserAlbumLikeByAlbumIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;

      await this._service.editAlbumById(id, { name, year });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'album berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postUserAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyExistingAlbumById(id);

    const isLiked = await this._userAlbumLikesService.verifyUserAlbumLike(
      credentialId,
      id,
    );

    if (!isLiked) {
      await this._userAlbumLikesService.addUserAlbumLikes(credentialId, id);

      const response = h.response({
        status: 'success',
        message: 'Album berhasil disukai',
      });

      response.code(201);

      return response;
    }

    await this._userAlbumLikesService.deleteUserAlbumLikes(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Batal menyukai album berhasil',
    });

    response.code(201);

    return response;
  }

  async getUserAlbumLikeByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const { number, source } = await this._userAlbumLikesService.getUserAlbumLikeByAlbumId(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: number,
      },
    });

    response.header('X-Data-Source', source);

    response.code(200);

    return response;
  }
}

module.exports = AlbumsHandler;
