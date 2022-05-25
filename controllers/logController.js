import LogModel from "../models/LogModel.js";

export const createLog = async (correo) => {
    try {
        let fecha = new Date()
        const fechaExacta = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`


        const log = {
            correo,
            fecha: fechaExacta
        }

        await LogModel.create(log);



    } catch (error) {
        console.log(error);
    }
}

export const getAllLogs = async (req, res) => {

    try {
        const logs = await LogModel.findAll();
        res.json(logs);
    } catch (error) {
        res.json({ message: error.message });
    }

}