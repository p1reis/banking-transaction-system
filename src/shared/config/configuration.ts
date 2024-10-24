export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    database: process.env.POSTGRES_DB,
    schema: process.env.POSTGRES_SCHEMA,
    url: process.env.DATABASE_URL,
  },
});
