import * as categoryRepository from "../repositories/category.repository.ts";
import type { Category } from "../repositories/category.repository.ts";




export async function getAll() :Promise<Category[]>{
const result = await categoryRepository.getAll();
return result;
}
export async function getById(id:categoryRepository.CategoryRow["id"]) :Promise<Category | null> {
const result = await categoryRepository.getById(id);
return result;
}

export async function getBySlug(slug:categoryRepository.CategoryRow["slug"]):Promise<Category | null> {
const result = await categoryRepository.getBySlug(slug);
return result;
}