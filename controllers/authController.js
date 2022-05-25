import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { promisify } from "util";
import "dotenv/config";
import PersonaModel from "../models/PersonaModel.js";
import { createLog } from "./logController.js"
let count = 0;

//Login
export const login = async (req, res) => {
  const password = req.body.password;
  let isOnline = null;
  let isAdmin = false;

  try {

    await PersonaModel.findOne({
      where: {
        Correo: req.body.email,
      },
    }).then(async (results) => {
      //Si el correo ingresado no existe en la base de datos O si la password es incorrecta
      if (
        results === null ||
        !(await bcryptjs.compare(password, results.password))
      ) {
        console.log("Email y/o contraseña incorrectos");
        isOnline = null;
        count = count + 1

        if (count === 3) {
          createLog(req.body.email)
          count = 0
        }
        return res.status(400).json({
          message: "El Email y/o contraseña son incorrectos",
          isOnline: isOnline,
        });

      } else {
        if (results.status !== "verified") {
          console.log("El usuario no tiene la cuenta verificada");
          return res.status(400).json({
            message: "Cuenta no verificada",
            isOnline: isOnline,
          })

        } else {


          const id = results.ID_Persona;
          const tipo_persona = results.ID_Tipo_persona;

          //se determina si el usuario es administrador o no
          tipo_persona === 1 ? (isAdmin = true) : (isAdmin = false);

          //Se establece que el usuario si esta registrado en la base de datos por lo tanto sera un usuario en linea (Online)
          isOnline = true;
          //Se genera el token
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          const cookiesOptions = {
            expires: new Date(
              Date.now() +
              parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          //Establecer la cookie con el nombre jwt el valor del token y las opciones de cookies
          res.cookie("jwt", token, cookiesOptions);

          res.json({
            isAdmin: isAdmin,
            isOnline: isOnline,
          })
        }
      }
    });
    /* res.json({
      isAdmin: isAdmin,
      isOnline: isOnline,
    }); */
  } catch (error) {
    console.log(error);
  }
};

export const readToken = async (req, res) => {
  if (req.cookies.jwt) {
    res.json({ isToken: true });
  } else {
    res.json({ isToken: false });
  }
};

export const logout = (req, res) => {

  res.clearCookie("jwt");
  return res.json({ message: "logout exitoso" })

};

//verificar si esta autenticado por medio de jwt
export const isAuthenticated = async (req, res, next) => {
  //se llama a las cookies, el jwt es porque asi definimos que se llamaria la misma cookie

  //si la cookie existe entonces entra al if
  if (req.cookies.jwt) {
    try {
      //se decodifica el jwt donde esta almacenado el id del usuario
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //se hace una consulta para buscar el id decodificado en la base de datos
      await PersonaModel.findOne({
        where: {
          ID_Persona: decodificada.id,
        },
      }).then((results) => {
        if (!results) {
          return next();
        }

        return next();
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    console.log("no esta autenticado");
  }
};


