import * as categoryRepository from "../repositories/category.repository.ts";

export async function getAll() {
const result = await categoryRepository.getAll();
return result;
}