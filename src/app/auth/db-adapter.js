import { Pool } from 'pg';

// Use your existing database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // For Neon DB
});

export default function PostgresAdapter() {
  return {
    async createUser(user) {
      const result = await pool.query(
        `INSERT INTO users (id, name, email, email_verified, image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, email_verified, image`,
        [
          crypto.randomUUID(),
          user.name,
          user.email,
          user.emailVerified,
          user.image,
        ]
      );
      return result.rows[0];
    },
    async getUser(id) {
      const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    },
    async getUserByEmail(email) {
      const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      return result.rows[0] || null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const result = await pool.query(
        `SELECT u.*
         FROM users u
         JOIN accounts a ON u.id = a.user_id
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      return result.rows[0] || null;
    },
    async updateUser(user) {
      const result = await pool.query(
        `UPDATE users
         SET name = $2, email = $3, email_verified = $4, image = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, name, email, email_verified, image`,
        [user.id, user.name, user.email, user.emailVerified, user.image]
      );
      return result.rows[0];
    },
    async deleteUser(userId) {
      await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
    },
    async linkAccount(account) {
      await pool.query(
        `INSERT INTO accounts (
          id, user_id, type, provider, provider_account_id,
          refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          crypto.randomUUID(),
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      );
      return account;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await pool.query(
        `DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2`,
        [provider, providerAccountId]
      );
    },
    async createSession(session) {
      const result = await pool.query(
        `INSERT INTO sessions (id, user_id, expires, session_token)
         VALUES ($1, $2, $3, $4)
         RETURNING id, session_token, user_id, expires`,
        [
          crypto.randomUUID(),
          session.userId,
          session.expires,
          session.sessionToken,
        ]
      );
      return result.rows[0];
    },
    async getSessionAndUser(sessionToken) {
      const sessionResult = await pool.query(
        `SELECT * FROM sessions WHERE session_token = $1`,
        [sessionToken]
      );

      if (!sessionResult.rows[0]) return null;

      const userResult = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [sessionResult.rows[0].user_id]
      );

      return {
        session: sessionResult.rows[0],
        user: userResult.rows[0],
      };
    },
    async updateSession(session) {
      const result = await pool.query(
        `UPDATE sessions
         SET expires = $2, updated_at = CURRENT_TIMESTAMP
         WHERE session_token = $1
         RETURNING id, session_token, user_id, expires`,
        [session.sessionToken, session.expires]
      );
      return result.rows[0];
    },
    async deleteSession(sessionToken) {
      await pool.query(
        `DELETE FROM sessions WHERE session_token = $1`,
        [sessionToken]
      );
    },
    async createVerificationToken(verificationToken) {
      await pool.query(
        `INSERT INTO verification_tokens (identifier, token, expires)
         VALUES ($1, $2, $3)`,
        [
          verificationToken.identifier,
          verificationToken.token,
          verificationToken.expires,
        ]
      );
      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const result = await pool.query(
        `DELETE FROM verification_tokens
         WHERE identifier = $1 AND token = $2
         RETURNING identifier, token, expires`,
        [identifier, token]
      );
      return result.rows[0] || null;
    },
  };
}