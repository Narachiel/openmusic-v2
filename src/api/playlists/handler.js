const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator, serviceSong) {
    this._service = service;
    this._validator = validator;
    this._serviceSong = serviceSong;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this);
    this.getSongsPlaylistHandler = this.getSongsPlaylistHandler.bind(this);
    this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this);
    // this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);
      return {
        status: 'success',
        data: {
          playlists,
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

  async deletePlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylist(id);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

  async postSongPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._serviceSong.getSongById(songId);
      await this._service.verifySongId(songId);
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.addSongPlaylist({ playlistId, songId });
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
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

  async getSongsPlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._service.getSongsPlaylist(id);
      // const songs = await this._service.getSongsPlaylist(id);
      return {
        status: 'success',
        data: {
          playlist,
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

  async deleteSongPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deleteSongPlaylist(playlistId, songId);
      return {
        status: 'success',
        message: 'Lagu Playlist berhasil dihapus',
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
}

module.exports = PlaylistsHandler;
