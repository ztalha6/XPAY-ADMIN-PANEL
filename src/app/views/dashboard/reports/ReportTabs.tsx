import React, {useEffect} from "react"
import ViewCard from "../../../components/dashboard/ViewCard";
import {Tabs} from "antd";
import SalesSummary from "./sales-summary/SalesSummary";
import "../../../../assets/css/views/dashboard/reports.scss"
import ItemSummaryReport from "./item-summary/ItemSummaryReport";
import {useUserContext} from "../../../providers/UserProvider";

export default function ReportTabs() {
    const {setTitle} = useUserContext()
    useEffect(()=>{
        setTitle("Reports")
    },[])
    const { TabPane } = Tabs;
    return(
        <>
            <ViewCard>
                <div className={"reports"}>
                    <div className={"theme-tabs"}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Sales Summary Reports (SSR)" key="1">
                                <SalesSummary/>
                            </TabPane>
                            <TabPane tab="Item Summary" key="2">
                                <ItemSummaryReport/>
                            </TabPane>
                            <TabPane tab="Discount Report" key="3">

                            </TabPane>
                            <TabPane tab="Deals & Combo Report" key="4">

                            </TabPane>
                            <TabPane tab="Payment Reports" key="5">

                            </TabPane>
                            <TabPane tab="Server Efficiency Report" key="6">

                            </TabPane>
                            <TabPane tab="Void Summery Report" key="7">

                            </TabPane>
                            <TabPane tab="86 Summery Report" key="8">

                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </ViewCard>
        </>
    )
}