import db from '../database/db.js'


import { DataTypes } from 'sequelize'

const LogModel = db.define('log', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    correo: { type: DataTypes.STRING },
    fecha: { type: DataTypes.STRING },

},
    {
        freezeTableName: true,
    })


export default LogModel