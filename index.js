import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
//importamos la conexion a la bd
import db from "./database/db.js";

import categoryRoute from "./routes/categoryRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js"
import logRoute from "./routes/logRoute.js"

const app = express();

//para trabajar con las cookies
app.use(cookieParser());

//seteamos la carpeta public para archivos estaticos
app.use(express.static("public"));

//sirve para procesar los datos enviados desde los forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

app.use("/categories", categoryRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/logs", logRoute);

//conexión a la base de datos
try {
  await db.authenticate();
  console.log("conexión exitosa a la BD");
} catch (error) {
  console.log("error a la BD" + error);
}

/* app.get('/', (req, res) => {
    res.send('oa')
}) */

app.listen(5000, () => {
  console.log("server listening on port");
});
