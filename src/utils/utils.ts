
export type  Pathparam = string | string[] | undefined; 

export function proccessQueryParam(param:Pathparam) : string {
return isNullOrUndefined(param) ? "" 
: Array.isArray(param) ? 
isNullOrUndefined(param[0]) ? "" : param.length > 0 && !param ? param[0] : "" : param || "";  
}

export const isNullOrUndefined = (value : any)=> value == undefined || value == null;