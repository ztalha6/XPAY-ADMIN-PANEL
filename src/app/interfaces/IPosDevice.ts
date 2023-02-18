import {IListGeneric} from "./ICommon";

export interface ICreateDevice  {
    name:string
    mac_address:string
    establishment_id:number
}
export interface IDeviceList extends IListGeneric{
    name:string
    mac_address:string
    establishment_id: number
    verification_code: number
}


