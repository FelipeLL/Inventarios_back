import db from "../database/db.js";

import { DataTypes } from "sequelize";

const PersonaModel = db.define(
  "persona",
  {
    ID_Persona: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    fotografia: { type: DataTypes.BLOB },
    ID_Tipo_persona: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default PersonaModel;
