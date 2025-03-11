/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')");

  // Mengubah nilai owner pada note yang owner-nya NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL");

  // Memberikan constraint foreign key pada kolom owner
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Menghapus constraint fk_notes.owner_users.id dari tabel notes
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes");

  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
