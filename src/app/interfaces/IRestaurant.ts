import {IListGeneric} from "./ICommon";
import {IPlanList} from "./IPlan";

export interface ICreateRestaurant{
    name : string,
    established_date: string,
    no_of_employees : number,
    no_of_establishments: number,
    status: number,
    subscription_id: number,
    owner_name: string,
    end_point: string,
    email: string,
    address: string,
    phone: string,
    setting: IRestaurantSetting
}
export interface IRestaurantSetting{
    payment_gateway: number,
    payment_secret_key: string,
    payment_publish_key: string,
    s3_end_point: string,
    s3_secret_key: string,
    s3_bucket_name: string,
    s3_region: string,
    s3_access_key_id: string,
    fcm_key: string,
    social_google_key: string,
    social_facebook_key: string,
    smtp_user: string,
    smtp_password: string,
    mysql_user: string,
    mysql_password: string,
    mysql_db_name: string
}

export interface ITableListing extends IListGeneric{
    table_number: number,
    establishment_id?: number,
    seating_capacity: number,
    floor: number,
}


export interface IRestaurantListing extends IListGeneric{
    name : string,
    established_date: string,
    no_of_employees : number,
    no_of_establishments: number,
    status: number,
    subscription_id: number,
    owner_name: string,
    email: string,
    address: string,
    phone: string,
    plan: IPlanList
    setting: {
        id:number
        payment_gateway: number,
        payment_gateway_text: string,
        payment_secret_key: string,
        payment_publish_key: string,
        s3_end_point: string,
        s3_secret_key: string,
        s3_bucket_name: string,
        s3_region: string,
        s3_access_key_id: string,
        fcm_key: string,
        social_google_key: string,
        social_facebook_key: string,
        smtp_user: string,
        smtp_password: string,
        created_at: string
        updated_at: string
        deleted_at: string
        created_ago: string
        status_text?: string
        meta:any
    }
}