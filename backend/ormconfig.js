const dbConf = () => {
  const defaultConf = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/**/entities/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'dev',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
    synchronize: true,
  };

  const testConfg = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST_TEST,
    port: process.env.POSTGRES_PORT_TEST,
    username: process.env.POSTGRES_USER_TEST,
    password: process.env.POSTGRES_PASSWORD_TEST,
    database: process.env.POSTGRES_DB_TEST,
    entities: ['dist/**/**/entities/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
  };

  const result = process.env.NODE_ENV === 'test' ? testConfg : defaultConf;

  console.log(
    `--- NODE_ENV ${process.env.NODE_ENV} used conf : ${JSON.stringify(
      result,
      null,
      2,
    )}`,
  );

  return result;
};

module.exports = dbConf();
