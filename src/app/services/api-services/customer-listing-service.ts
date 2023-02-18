// import {ITokenResponse, IVerifyLoginResponse} from '../../interfaces/IAuth.interfaces';
import {api} from './api.service';
import {IAPIResponse, IPaginated} from "../../interfaces/ICommon";
import {PAGINATION} from "../../config/constants";
import {ICustomerListing, ICustomerOrderItemListing} from "../../interfaces/ICustomerManagement";
import {IOrderList} from "../../interfaces/IOrder";


export class CustomerServices {
    public static async index(params:any, perPage:number=PAGINATION.perPage, page:number=1): Promise<IAPIResponse<IPaginated<ICustomerListing[]>>> {
        const res = await api.get(`customers`,{params:{"per-page":perPage, page,pagination:true,...params}})
        return res.data as IAPIResponse<IPaginated<ICustomerListing[]>>;
    }

    public static async getCustomerOrderItems(params:any, perPage:number=PAGINATION.perPage, page:number=1): Promise<IAPIResponse<IPaginated<ICustomerOrderItemListing[]>>> {
        const res = await api.get(`get-customer-order-items`,{params:{"per-page":perPage, page,pagination:true,...params}})
        return res.data as IAPIResponse<IPaginated<ICustomerOrderItemListing[]>>;
    }

    public static async getCustomerOrders(params:any, perPage:number=PAGINATION.perPage, page:number=1): Promise<IAPIResponse<IPaginated<IOrderList[]>>> {
        const res = await api.get(`get-customer-orders`,{params:{"per-page":perPage, page,pagination:true,...params}})
        return res.data as IAPIResponse<IPaginated<IOrderList[]>>;
    }

    public static async getById(id:string|undefined, params?:any): Promise<IAPIResponse<ICustomerListing>> {
        const res = await api.get(`customers/${id}`, {params:{...params}})
        return res.data as IAPIResponse<ICustomerListing>;
    }
}


