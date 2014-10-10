module.exports = {

  development: {
    client: 'postgres',
    connection: {
      host     : process.env.APP_DB_HOST     || '127.0.0.1',
      user     : process.env.APP_DB_USER     || '',
      password : process.env.APP_DB_PASSWORD || '',
      database : process.env.APP_DB_NAME     || 'people'
<<<<<<< HEAD
}
=======
    }
  },

  testing: {
    client: 'postgres',
    connection: {
      host     : process.env.APP_DB_HOST     || '127.0.0.1',
      user     : process.env.APP_DB_USER     || '',
      password : process.env.APP_DB_PASSWORD || '',
      database : process.env.APP_DB_NAME     || 'people_test'
    }
>>>>>>> 5b8885b15249fe8a81aa09fe47d28711980dd257
  },

  staging: {
    client: 'postgres',
    connection: process.env.DATABASE_URL
  },
  production: {
    client: 'postgres',
    connection: process.env.DATABASE_URL
  }
};
