export interface IWebsiteCMS{
    primary_color:string;
    secondary_color:string;
    logos?:{
        path: string
    }[]
    logo: string
    type: number
    banners:{
        path: string
    }[]
}

export interface IGetCMS{
    primary_color:string;
    secondary_color:string;
    web_logo: media
    web_banners: media[]
    app_logo: media
    app_banners: media[]
}

interface media {
    path: string
    mediaUrl: string
}
