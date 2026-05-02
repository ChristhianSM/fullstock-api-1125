import type { QueryResult } from "pg";
import { query as PoolQuery } from "./connections/pool/conections.ts";

export const query = async <T extends QueryResult> (querySQl : string,params?: unknown[]) :Promise<T> => {
  console.log("Conexion Test con POOL connection ....");
  try {
    const queryResult :QueryResult = await PoolQuery<QueryResult>(querySQl,params);
    return queryResult as T;

  } catch (error) {
    console.log("no fue posible conectarse con la BD",error);
     throw Error("no fue posible conectarse con la BD");
  }
}