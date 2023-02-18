// import {ITokenResponse, IVerifyLoginResponse} from '../../interfaces/IAuth.interfaces';
import {api} from './api.service';
import {IAuth, IProfile, IUserLogin} from "../../interfaces/IAuth";
import {IAPIResponse, IPaginated} from "../../interfaces/ICommon";
import {
  IRegisterRestaurantOwner,
  IUser,
  IUserAdminPanelRegistration,
  IUserAdminPanelUpdate
} from "../../interfaces/IUser";
import {PAGINATION} from "../../config/constants";


export class UserAuthService {

  private static storageKey = 'SE_AUTH_TOKEN';
  private static userStorageKey = 'SE_USER_OBJECT';

  public static async login(data:IAuth): Promise<IAPIResponse<IUserLogin>> {
    const res = await api.post('login', data)
    this.setToken(res.data?.data?.access_token.token);
    console.log(`Token:`, this.getToken())
    return res.data as IAPIResponse<IUserLogin>;
  }

  /**
   * This function will confirm that the user is logged in and if they are not will log them out and
   * redirect to the login screen
   * @returns IVerifyLoginResponse
   */


  public static async index(perPage:number=PAGINATION.perPage, page:number=1, params?:any): Promise<IAPIResponse<IPaginated<IUser[]>>> {
    const res = await api.get('get-restaurant-users',{params:{"per-page":perPage, page, ...params}})
    return res.data as IAPIResponse<IPaginated<IUser[]>>;
  }

  public static async getAdmins(perPage:number=PAGINATION.perPage, page:number=1, params?:any): Promise<IAPIResponse<IPaginated<IUser[]>>> {
    const res = await api.get('get-restaurant-admins',{params:{"per-page":perPage, page, ...params}})
    return res.data as IAPIResponse<IPaginated<IUser[]>>;
  }

  public static async getById(id:string|undefined): Promise<IAPIResponse<IUser>> {
    const res = await api.get(`users/${id}`)
    return res.data as IAPIResponse<IUser>;
  }

  public static async destroy(id:number): Promise<IAPIResponse<any>> {
    const res = await api.delete(`users/${id}`)
    return res.data as IAPIResponse<any>;
  }

  public static async getUser(): Promise<IAPIResponse<IProfile>> {
    const res = await api.get('me')
    return res.data as Promise<IAPIResponse<IProfile>>;
  }

  // Reset Password routes
  public static async sendEmail(email: string): Promise<boolean> {
    const res = await api.post('/api/auth/reset-password-email', { email });
    return res.data as any
  }

  public static async resetPassword(token: string, email: string, password: string): Promise<boolean> {
    const res = await api.post(`/api/auth/reset-password/${token}`, { email, password });
    return res.data as any
  }

  // Token Helpers
  public static getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  public static isAuthenticated = ():boolean => {
    /*todo: Do Expiry check from token*/
    return !!this.getToken()
  }


  public static setToken(token: string | null): void {
    if (token) localStorage.setItem(this.storageKey, token);
    else localStorage.removeItem(this.storageKey);
  }

  public static logout() {
    this.setToken(null);
    localStorage.removeItem('establishmentId');
    window.location.assign(`/?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
  public static async registerUser(data:IUserAdminPanelRegistration): Promise<IAPIResponse<any>> {
    const res = await api.post('register', data)
    return res.data as IAPIResponse<any>;
  }

  public static async registerRestaurantAdmin(data:IRegisterRestaurantOwner): Promise<IAPIResponse<any>> {
    const res = await api.post('register-restaurant-admin', data)
    return res.data as IAPIResponse<any>;
  }

  public static async updateUser(id:string|undefined,data:IUserAdminPanelUpdate): Promise<IAPIResponse<any>> {
    const res = await api.put(`users/${id}`, data)
    return res.data as IAPIResponse<any>;
  }

}
