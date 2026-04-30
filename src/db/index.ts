import { type QueryResultRow } from "pg";
import { query as PoolQuery } from "./connections/pool/conections.ts";

export const query = async <T extends QueryResultRow> (querySQl : string)=> {
  console.log("Conexion Test con POOL connection ....");
  try {
    const queryResult = await PoolQuery<T>(querySQl);
    return  queryResult;
  } catch (error) {
    console.log("no fue posible conectarse con la BD",error);
     throw Error("no fue posible conectarse con la BD");
  }
}