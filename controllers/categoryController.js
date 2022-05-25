import CategoryModel from "../models/categoryModel.js";

/**
*? Métodos para el CRUD
*/

//Traer todas las categorias
export const getAllCategory = async (req, res) => {
    try {
        //findAll es de sequelize
        const categories = await CategoryModel.findAll()
        res.json(categories)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Traer 1 categoria en especifico
export const getCategory = async(req, res) => {
    try {
       const category = await CategoryModel.findAll({ 
            where:{ ID_Categoria: req.params.id }
        })
        res.json(category[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Insertar categoria
export const createCategory = async(req, res) => {
    try {
        await CategoryModel.create(req.body)
        res.json({message: "Categoria insertada correctamente"})
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar categoria
export const updateCategory = async(req, res) => {
    try {
        await CategoryModel.update(req.body, {
            where: { ID_Categoria: req.params.id}
        })
        res.json({message: "Categoria actualizada correctamente"})

    } catch (error) {
        res.json({message: error.message})
    }
}

//Eliminar categoria
export const deleteCategory = async(req, res) => {
    try {
        await CategoryModel.destroy({ 
            where: {ID_Categoria: req.params.id}
        })
        res.json({message: "Categoria eliminada correctamente"})
    } catch (error) {
        res.json({message: error.message})
    }
}