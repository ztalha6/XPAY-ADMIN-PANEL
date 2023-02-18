import {IAPIResponse, IPaginated} from "../../interfaces/ICommon";
import {api} from "./api.service";
import {ITransactionListing} from "../../interfaces/ITransactions";
import {
    IDashboardAnalyticsParams,
    IDashboardAnalyticsResponse,
    IItemSummaryReport,
    IReportList
} from "../../interfaces/IReports";
import {PAGINATION} from "../../config/constants";


export class ReportService {
    public static async index(params?:any): Promise<IAPIResponse<IReportList>> {
        const res = await api.get(`reports`,{params:{...params}})
        return res.data as IAPIResponse<IReportList>;
    }
    public static async getItemSummaryReport(perPage:number=PAGINATION.perPage, page:number=1,params?:any): Promise<IAPIResponse<IPaginated<IItemSummaryReport[]>>> {
        const res = await api.get(`item-summary-report`,{params:{"per-page":perPage, page,...params}})
        return res.data as IAPIResponse<IPaginated<IItemSummaryReport[]>>;
    }
    public static async getById(id:string|undefined): Promise<IAPIResponse<ITransactionListing>> {
        const res = await api.get(`transactions/${id}`)
        return res.data as IAPIResponse<ITransactionListing>;
    }
    public static async dashboardAnalytics(params?:IDashboardAnalyticsParams): Promise<IAPIResponse<IDashboardAnalyticsResponse>> {
        const res = await api.get(`dashboard-analytics`,{params:{...params}})
        return res.data as IAPIResponse<IDashboardAnalyticsResponse>;
    }

}