//un modelo es una abstracción que representa una tabla en la base de datos 

//importamos la conexion a la base de datos
import db from '../database/db.js'

//importamos sequelize
import {DataTypes} from 'sequelize'

//definir la conexion y se le asigna una constante, se le pasa el nombre de la tabla
const CategoryModel = db.define('categoria', {
    ID_Categoria: {type: DataTypes.INTEGER, primaryKey:true },
    nombre: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING},
    marca: {type: DataTypes.STRING},

})

export default CategoryModel