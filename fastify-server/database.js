import { DataTypes, Sequelize } from 'sequelize';


const sequelize = new Sequelize('mysql://root:@127.0.0.1:3306/js_database')
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


export const Tasks = sequelize.define('Tasks', {
    name: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.BOOLEAN
    }
});

Tasks.sync()