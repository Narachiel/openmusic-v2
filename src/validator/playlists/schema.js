const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string(),
});

const PostSongPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

// eslint-disable-next-line max-len
module.exports = { PostPlaylistPayloadSchema, PostSongPlaylistPayloadSchema, DeleteSongPlaylistPayloadSchema };
