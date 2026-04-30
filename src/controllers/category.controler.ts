import type {Request,Response } from "express";
import * as categoryService from "../services/category.services.ts";

export async function getCategories(_req : Request,res:Response) {
const categories = await categoryService.getAll();
res.status(200).json({data:categories,status:"success"});
    
}