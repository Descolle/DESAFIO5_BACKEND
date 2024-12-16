import express from "express";
import {
  filtrarjoyas,
  Obtenerjoyas,
  Obtenerjoyaslimitadas,
  prepararHATEOAS,
} from "../controllers/controllers.js";

const router = express.Router();

//ruta para obtener ltodo el inventario
router.get("/joyas/", Obtenerjoyas);

//ruta para obtener joyas, pero limitadas a 5

router.get("/joyas/limit", async (req, res) => {
  try {
    const queryString = req.query;
    const inventario = await Obtenerjoyaslimitadas(queryString);
    const HATEOAS = await prepararHATEOAS(inventario);
    res.json({
      status: "success",
      data: inventario,
      HATEOAS: HATEOAS,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud",
    });
  }
});

//ruta para filtros
router.get("/joyas/filter", async (req, res) => {
  try {
    const queryString = req.query;
    const inventario = await filtrarjoyas(queryString);
    if (inventario.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron joyas con los filtros aplicados",
      });
    }
    res.status(200).json({
      status: "success",
      data: inventario,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud",
    });
  }
});

export default router;
