const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { id } = request.params;
      const { cover } = request.payload;

      this._validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._service.writeFile(cover, cover.hapi);
      const coverUrl = `http:${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

      await this._albumsService.addAlbumImage(id, coverUrl);

      const response = h
        .response({
          status: 'success',
          message: 'Cover berhasil diunggah',
        })
        .code(201);

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

      // SERVER ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);

      console.error(error);

      return response;
    }
  }
}

module.exports = UploadsHandler;
