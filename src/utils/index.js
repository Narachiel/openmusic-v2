const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
  name,
  song_id,
  username,
  owner,
  playlist_id,
  user_id,
  cover,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
  name,
  songId: song_id,
  username,
  owner,
  playlistId: playlist_id,
  userId: user_id,
  coverUrl: cover,
});

module.exports = { mapDBToSongModel };
