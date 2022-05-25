import {Sequelize} from 'sequelize';


const db = new Sequelize('Inventario', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db