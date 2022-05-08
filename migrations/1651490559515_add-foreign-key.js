/* eslint-disable camelcase */

exports.up = (pgm) => {
  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint 'fk_playlists.owner_users.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

  // menghapus constraint 'fk_songs.album_id_albums.id songs
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
