// import {ITokenResponse, IVerifyLoginResponse} from '../../interfaces/IAuth.interfaces';
import {api} from './api.service';
import {IAPIResponse, IPaginated} from "../../interfaces/ICommon";
import {ICreateEstablishment, IGetEstablishment, IGetEstablishmentDropdown} from "../../interfaces/IGetEstablishment";
import {PAGINATION} from "../../config/constants";


export class EstablishmentServices {

  public static async index(perPage:number=PAGINATION.perPage, page:number=1, params?:any): Promise<IAPIResponse<IPaginated<IGetEstablishment[]>>> {
    const res = await api.get('get-establishments',{params:{"per-page":perPage, page,...params}})
    return res.data as IAPIResponse<IPaginated<IGetEstablishment[]>>;
  }

  /*To get all resources without pagination usually for dropdowns*/
  public static async all(): Promise<IAPIResponse<IGetEstablishmentDropdown[]>> {
    const res = await api.get('get-establishments',{params:{pagination:false}})
    return res.data as IAPIResponse<IGetEstablishmentDropdown[]>;
  }

  public static async store(data:ICreateEstablishment): Promise<IAPIResponse> {
    const res = await api.post('establishments', data)
    return res.data as IAPIResponse;
  }

  public static async destroy(id:number): Promise<IAPIResponse<any>> {
    const res = await api.delete(`establishments/${id}`)
    return res.data as IAPIResponse<any>;
  }

  public static async getById(id:string|undefined): Promise<IAPIResponse<IGetEstablishment>> {
    const res = await api.get(`get-single-establishment/${id}`)
    return res.data as IAPIResponse<IGetEstablishment>;
  }
  public static async updateEstablishment(id:string|undefined,data:ICreateEstablishment): Promise<IAPIResponse<any>> {
    const res = await api.put(`establishments/${id}`, data)
    return res.data as IAPIResponse<any>;
  }

}
