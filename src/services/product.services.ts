import * as productRepository from "../repositories/products.repository.ts";
import type { ProductRow,Product } from "../repositories/products.repository.ts";
import { isNullOrUndefined } from "../utils/utils.ts";


export const getProductsByCategoryId= async (slug:ProductRow["slug"]):
Promise<Product[] | null>  =>{
    return await  productRepository.getBySlug(slug);
}

export const getProductBySlug = async (slug:ProductRow["slug"]):
Promise<Product |null| undefined>  =>{

    const products :Product[]= await productRepository.getAll();
    console.log("products http -> ",products);
    const productFind:Product|undefined = 
    products.find((product)=> product.slug === slug);
    return !isNullOrUndefined(productFind) ? productFind  : null ;

}

