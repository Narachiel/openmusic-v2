const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLikes(userId, albumId) {
    const id = `user_album_like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteUserAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        'Gagal membatalkan album yang disukai. Id tidak ditemukan',
      );
    }

    await this._cacheService.delete(`user_album_likes:${albumId}`);
  }

  async getUserAlbumLikeByAlbumId(albumId) {
    try {
      const result = await this._cacheService.get(
        `user_album_likes:${albumId}`,
      );

      return {
        number: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `user_album_likes:${albumId}`,
        JSON.stringify(result.rows.length),
      );

      return {
        number: result.rows.length,
        source: 'db',
      };
    }
  }

  async verifyUserAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.length;
  }
}

module.exports = UserAlbumLikesService;
