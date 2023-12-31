const {DataSource} = require('typeorm')

const dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    migrationsTableName: 'migrations'
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        })
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true
        })
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity.ts'],
            ssl: {
                rejectUnauthorized: false
            }
        })
    default :
        throw new Error('Unknown Environment');
}

export {dbConfig};

export default new DataSource(dbConfig);