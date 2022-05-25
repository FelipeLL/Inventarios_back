import PersonaModel from "../models/PersonaModel.js";
import bcryptjs from "bcryptjs";
import { promisify } from "util";
import { getTemplate, sendEmail, getTemplateAlert } from "../config/mail.config.js"
import jwt from "jsonwebtoken";
//CRUD Personas

export const getAllUsers = async (req, res) => {
    try {
        const users = await PersonaModel.findAll();
        res.json(users);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await PersonaModel.findAll({
            where: { ID_Persona: req.params.id },
        });
        res.json(user[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {

        const password = req.body.password;
        const email = req.body.correo

        //verificar si el usuario ya existe en la base de datos

        const verifyEmailExist = await PersonaModel.findOne({
            where: {
                Correo: email,
            },
        })
        if (verifyEmailExist !== null) {
            res.status(400).json({ message: "El correo ya existe en la base de datos", emailExist: true })

        } else {
            console.log("el email no existe");

            //se encripta la pass
            let passHash = await bcryptjs.hash(password, 8);
            const user = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                telefono: req.body.telefono,
                correo: req.body.correo,
                password: passHash,
                ID_Tipo_persona: 2,
                status: "unverified"
            };

            //generar token
            const token = jwt.sign({ correo: email }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            //obtener template
            const template = getTemplate(req.body.nombre, token)



            //enviar email
            await sendEmail(email, "Confirmación de cuenta", template)




            await PersonaModel.create(user);

            res.json({ message: "Persona insertada correctamente" });
        }



    } catch (error) {
        res.status(400)
        res.json({ message: error.message });
    }
};

export const confirmAccount = async (req, res) => {
    try {

        //obtener token
        const { token } = req.params

        console.log("a");

        //verificar la data
        const decodificada = jwt.verify(token, process.env.JWT_SECRET)


        console.log(decodificada);
        //obteniendo el correo que esta en el token
        const { correo } = decodificada

        //buscar si existe el correo que trae la data (token)
        const user = await PersonaModel.findOne({
            where: {
                Correo: correo,
            },
        })

        //actualizar el status del usuario y redireccionar
        user.status = "verified"


        await PersonaModel.update(user.dataValues, {
            where: { ID_Persona: user.ID_Persona },
        });

        res.json({ message: "Usuario verificado correctamente" });



    } catch (error) {
        res.json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {


    //se decodifica el jwt donde esta almacenado el id del usuario
    const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
    );

    const usuario = await PersonaModel.findOne({
        where: {
            ID_Persona: decodificada.id,
        },
    })

    if (!(await bcryptjs.compare(req.body.currentPassword, usuario.password))) {
        console.log("La contraseña NO coincide");
        res.status(400).json({ message: "La contraseña NO coincide" })
    } else {

        let passHash = await bcryptjs.hash(req.body.confirmPassword, 8);

        usuario.password = passHash

        await PersonaModel.update(usuario.dataValues, {
            where: { ID_Persona: decodificada.id },
        });

        //obtener template
        const template = getTemplateAlert(usuario.nombre)

        //enviar email
        await sendEmail(usuario.correo, "Actualización de contraseña", template)



        res.json({ message: "Contraseña actualizada correctamente" });


    }



}

export const updateUser = async (req, res) => {
    try {
        await PersonaModel.update(req.body, {
            where: { ID_Persona: req.params.id },
        });
        res.json({ message: "Categoria actualizada correctamente" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await PersonaModel.destroy({
            where: { ID_Persona: req.params.id },
        });
        res.json({ message: "Persona eliminada correctamente" });
    } catch (error) {
        res.json({ message: error.message });
    }
};