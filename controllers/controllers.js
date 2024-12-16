import pool from "../config/config.js";
import format from "pg-format";

export const prepararHATEOAS = (inventario) => {
  const results = inventario
    .map((m) => {
      return {
        name: m.nombre,
        categoria: m.categoria,
        metal: m.metal,
        precio: m.precio,
        href: `/inventario/joya/${m.id}`,
      };
    })
    .slice(0, 4);
  const total = inventario.length;
  const HATEOAS = {
    total,
    results,
  };
  return HATEOAS;
};

//obtener inventario

export const Obtenerjoyas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventario");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error al obtener el inventario");
  }
};

//me permite obtener las joyas por orden, limite y paginado
export const Obtenerjoyaslimitadas = async ({
  limits = 5,
  order_by = "id_ASC",
  page = 1,
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = (page - 1) * limits;
  const formatttedQuery = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset
  );
  const { rows: inventario } = await pool.query(formatttedQuery);
  return inventario;
};

export const filtrarjoyas = async ({
  precio_max,
  stock_min,
  categoria,
  metal,
}) => {
  let filtros = [];
  const values = [];

  const agregarFiltro = (campo, comparador, valor) => {
    if (valor !== undefined && valor !== null) {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    }
  };

  agregarFiltro("precio", "<=", precio_max);
  agregarFiltro("stock", ">=", stock_min);
  agregarFiltro("categoria", "=", categoria);
  agregarFiltro("metal", "=", metal);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    consulta += ` WHERE ${filtros.join(" AND ")}`;
  }

  console.log("Consulta generada:", consulta, "Valores:", values);

  try {
    const { rows: inventario } = await pool.query(consulta, values);
    return inventario;
  } catch (error) {
    console.error("Error en la consulta:", error);
    throw error;
  }
};
