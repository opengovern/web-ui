


import { Schema } from "./types";

// For whole schema
// type 1 credential
// type 0 integration


export const GetActions=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.actions.credentials
    }

    return schema.actions.integrations

}

export const GetTableColumns=(type: number,schema: Schema)=>{
    if(type===1){
        const fields = schema.list.credentials.display.displayFields
        return fields.sort((a,b)=>a.order-b.order).map((field)=>{
            return {
                title: field.label,
                dataIndex: field.name,
                key: field.name,
                sorter: field.sortable,
                filter: field.filterable,

            }
        })
        
    }

    const fields = schema.list.integrations.display.displayFields
    return fields.sort((a,b)=>a.order-b.order).map((field)=>{
        return {
            title: field.label,
            dataIndex: field.name,
            key: field.name,
            sorter: field.sortable,
            filter: field.filterable
        }
    })
}

export const GetTableColumnsDefintion=(type: number,schema: Schema)=>{
    return []
}

export const GetView=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.view.credential_details
    }

    return schema.view.integration_details
}

export const GetDetails=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.view.credential_details
    }

    return schema.view.integration_details
}

export const GetDetailsFields=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.view.credential_details.fields
    }

    return schema.view.integration_details.fields
}

export const GetDetailsActions=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.view.credential_details.allowedActions
    }

    return schema.view.integration_details.allowedActions
}

export const GetDefaultPageSize=(type: number,schema: Schema)=>{
    if(type===1){
        return schema.list.credentials.defaultPageSize
    }

    return schema.list.integrations.defaultPageSize
}

export const GetLogo=(schema: Schema)=>{
    return schema.icon
}





