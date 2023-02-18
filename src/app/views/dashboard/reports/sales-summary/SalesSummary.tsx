import React, {useEffect, useState} from "react"
import {Col, Form, Row} from "react-bootstrap"
import {FormProvider, useForm} from "react-hook-form";
import {useUserContext} from "../../../../providers/UserProvider";
import {BACKEND_CONSTANTS} from "../../../../config/constants";
import {IReportList, IReportsFilters} from "../../../../interfaces/IReports";
import {Tabs} from "antd";
import "../../../../../assets/css/views/dashboard/sales-summary.scss"
import {IoMdArrowDropdown} from "react-icons/io"
import {
    ExcelIcon,
    ReportCancel,
    ReportExchange,
    ReportList,
    ReportMade,
    ReportRefund,
    ReportUnmade
} from "../../../../../assets/images/icons/menu-icons/performances"
import BarChart from "../../../../components/charts/BarChart";
import {ReportService} from "../../../../services/api-services/report.service";
import ThemeButton from "../../../../components/dashboard/ThemeButton";
import SalesSummaryFilters from "./SalesSummaryFilters";
import {FaFilter} from "react-icons/fa";
import ThemeModal from "../../../../components/Modal";

// Charts js

export default function SalesSummary() {

    const { TabPane } = Tabs;
    const [filterPopup, setFilterPopup] = useState<boolean>(false);
    const [reports, setReports] = useState<IReportList>();
    const [loading, setLoading] = useState<boolean>(false);
    const [filterLoading, setFilterLoading] = useState<boolean>(false);

    const paymentType = [
        {
            id: BACKEND_CONSTANTS.TRANSACTION.PAYMENT_TYPE.CARD,
            name: 'Card'
        },
        {
            id: BACKEND_CONSTANTS.TRANSACTION.PAYMENT_TYPE.CASH,
            name: 'Cash'
        },
        {
            id: BACKEND_CONSTANTS.TRANSACTION.PAYMENT_TYPE.EASY_PAISA,
            name: 'Easy Paisa'
        },
        {
            id: BACKEND_CONSTANTS.TRANSACTION.PAYMENT_TYPE.KEENU,
            name: 'Keenu'
        }
    ]
    const orderType = [
        {
            id: BACKEND_CONSTANTS.ORDERS.TYPES.DELIVERY,
            name:'Delivery'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.TYPES.DINE,
            name:'Dine In'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.TYPES.ONLINE,
            name:'Online'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.TYPES.TAKEAWAY,
            name:'Take away'
        }
    ]
    const orderPlatforms = [
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.IOS,
            name:'iOS'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.ANDROID,
            name:'Android'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.WEB,
            name:'Web'
        },
        {
            id:BACKEND_CONSTANTS.ORDERS.ORDER_PLATFORMS.POS,
            name:'POS'
        }
    ]


    const {setTitle, establishmentId} = useUserContext()
    useEffect(()=>{
        fetchData()
    },[])

    const methods = useForm<IReportsFilters>({
        shouldUnregister: false,
        mode: "onChange",
    });
    const onSubmit = async (data:IReportsFilters)=> {
        setFilterLoading(true)
        const filterData = {
            start_date: data.date_range?.[0],
            end_date: data.date_range?.[1],
            establishment_id: establishmentId
        }
        fetchData(filterData);
    }
    const fetchData = async (data?:IReportsFilters) => {
        setLoading(true);
        const res = await ReportService.index(data)
        if(res.status){
            setReports(res.data)
        }
        setLoading(false);
        setFilterLoading(false)
    }

    //Tab Button
    const operations = <button className={"excel-btn btn"}>{ ExcelIcon} Export CSV</button>;

    // All Chart
    const labels = ['12pm', '1pm', '2pm', '3pm ', '4pm', '5pm', '6pm', '7pm', '8pm' , '9pm', '10pm', '11pm', '12am','1am' ,'2am' , '3am ', '4am', '5am', '6am', '7am', '8am' , '9am', '10am', '11am'];
    const AllChart = [
        {
            label: 'Dine-in',
            data: [487, 100 , 287, 300 ,477, 500 , 687, 800, 287, 100, 887, 900, 787, 500, 387, 150, 587, 700, 987, 500, 487, 300, 457, 1000],
            backgroundColor: 'rgba(1, 120, 229,0.9)',
        },
        {
            label: 'Takeaway',
            data: [887, 500 , 187, 800 ,457, 300 , 487, 100, 887, 900, 187, 200, 787, 800, 287, 650, 187, 400, 987, 200, 387, 500, 457, 300],
            backgroundColor: 'rgba(252, 187, 54,0.9)',
        },
        {
            label: 'Delivery',
            data: [387, 100 , 887, 670 ,257, 670 , 927, 600, 817, 270, 457, 260, 737, 790, 127, 780, 907, 230, 697, 190, 497, 100, 597, 490],
            backgroundColor: 'rgba(110, 201, 168,0.9)',
        },
    ]
    const DineChart = [
        {
            label: 'Takeaway',
            data: [887, 500 , 187, 800 ,457, 300 , 487, 100, 887, 900, 187, 200, 787, 800, 287, 650, 187, 400, 987, 200, 387, 500, 457, 300],
            backgroundColor: 'rgba(252, 187, 54,0.9)',
        },
    ]
    const TakeawayChart = [
        {
            label: 'Dine-in',
            data: [
                {
                    x:'12pm',
                    y:400
                },
                {
                    x:'1pm',
                    y:700
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
                {
                    x:0,
                    y:4
                },
            ],
            backgroundColor: 'rgba(1, 120, 229,0.9)',
        },
    ]
    const DeliveryChart = [
        {
            label: 'Delivery',
            data: [387, 100 , 887, 670 ,257, 670 , 927, 600, 817, 270, 457, 260, 737, 790, 127, 780, 907, 230, 697, 190, 497, 100, 597, 490],
            backgroundColor: 'rgba(110, 201, 168,0.9)',
        },
    ]
    const filterModal =()=> {
        setFilterPopup(true)
    }
    return(
        <>
            <div className={"sales-summary"}>
                <FormProvider  {...methods}>
                    <Form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Row>
                            <div  className={"d-block d-md-none"}>
                                <div className={"filter-sec"}>
                                    <ThemeButton onClick={()=>{filterModal()}} className={"filter-popup-btn"} text={"Filter"} type={"submit"} suffixIcon={<FaFilter/>}/>
                                </div>
                            </div>
                            <div className={"d-none d-md-block"}>
                                <SalesSummaryFilters loading={filterLoading}/>
                            </div>
                        </Row>
                        <ThemeModal title={'Filters'} active={filterPopup} setActive={setFilterPopup}
                                    children={  <SalesSummaryFilters loading={filterLoading}/>} />
                    </Form>
                </FormProvider>
                <hr/>
                <Row>
                    <Col md={12}>
                        <div className={"theme-tabs"}>
                            <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
                                <TabPane tab="All" key="1">
                                    <Row>
                                        <Col md={12}>
                                            <BarChart xLabels={labels} dataSets={AllChart}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="Dine-in" key="2">
                                    <Row>
                                        <Col md={12}>
                                            <BarChart xLabels={labels} dataSets={DineChart}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="Takeaway" key="3">
                                    <Row>
                                        <Col md={12}>
                                            <BarChart xLabels={labels} dataSets={TakeawayChart}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="Delivery" key="4">
                                    <Row>
                                        <Col md={12}>
                                            <BarChart xLabels={labels} dataSets={DeliveryChart}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <div className={"left-col"}>
                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Sales</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Net Sales
                                                </h4>
                                                <p>{reports?.net_amount.current}</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.net_amount.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Gross Sales</h4>
                                                <p>{reports?.gross_amount.current}
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.gross_amount.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Service Charges</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Total Service  Charges</h4>
                                                <p>{reports?.service_charges.current}</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.service_charges.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Tip By Cash</h4>
                                                <p>{reports?.tip.current}</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.tip.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Tip By Card</h4>
                                                <p>0</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Discounts</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Manual Discount</h4>
                                                <p>{reports?.discount.current}</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.discount.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Promotional Discount
                                                </h4>
                                                <p>{reports?.promo_discount.current}</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.promo_discount.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Payment</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Cash</h4>
                                                <p>{reports?.cash_amount_received.current}
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.cash_amount_received.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Credit Card</h4>
                                                <p>{reports?.card_amount_received.current}
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>{reports?.card_amount_received.diff}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Guest</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Total Guest</h4>
                                                <p>0
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Avg. Amount per Guest</h4>
                                                <p>0</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Avg. No# Guest
                                                </h4>
                                                <p>0</p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className={"report-section"}>
                                <h3 className={"report-heading"}>Open Check</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Open Check Count</h4>
                                                <p>0
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"report-box"}>
                                            <div className={"report-details"}>
                                                <h4>Open Check Amount</h4>
                                                <p>0
                                                </p>
                                            </div>
                                            <div className={"report-stats up"}>
                                                <div className={"icon"}>
                                                    <IoMdArrowDropdown/>
                                                </div>
                                                <div className={"num"}>
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-stats-section"}>
                                <div className={"report-stats-box"}>

                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className={"right-col"}>
                            <div className={"report-section-right"}>
                                <h3 className={"report-heading"}>Dine-in</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"stats-boxes "}>
                                            <h5>Dine-In Sales</h5>
                                            <p>{reports?.dinein_net_amount.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes"}>
                                            <h5>Check</h5>
                                            <p>{reports?.dinein_check.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes"}>
                                            <h5>Average</h5>
                                            <p>{reports?.dinein_avg_amount.current}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section-right"}>
                                <h3 className={"report-heading"}>Takeaway</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"stats-boxes takeaway"}>
                                            <h5>Take away Sales</h5>
                                            <p>{reports?.takeaway_net_amount.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes takeaway"}>
                                            <h5>Check</h5>
                                            <p>{reports?.takeaway_check.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes takeaway"}>
                                            <h5>Average</h5>
                                            <p>{reports?.takeaway_avg_amount.current}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section-right"}>
                                <h3 className={"report-heading"}>Delivery</h3>
                                <ul className={""}>
                                    <li>
                                        <div className={"stats-boxes delivery"}>
                                            <h5>Delivery</h5>
                                            <p>{reports?.delivery_net_amount.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes delivery"}>
                                            <h5>Check</h5>
                                            <p>{reports?.delivery_check.current}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={"stats-boxes delivery"}>
                                            <h5>Average</h5>
                                            <p>{reports?.delivery_avg_amount.current}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"report-section-right"}>
                                <h3 className={"report-heading"}>Sales Category</h3>
                                <div className={"category-box"}>
                                    <div className={"icon-box"}>
                                        {ReportMade}
                                    </div>
                                    <div className={"content"}>
                                        <h6>Food</h6>
                                        <p>8,15,856 <span>40%</span></p>
                                    </div>
                                </div>
                                <div className={"category-box"}>
                                    <div className={"icon-box"}>
                                        {ReportMade}
                                    </div>
                                    <div className={"content"}>
                                        <h6>Beragres</h6>
                                        <p>6,18,484<span>27%</span></p>
                                    </div>
                                </div>
                                <div className={"category-box"}>
                                    <div className={"icon-box"}>
                                        {ReportMade}
                                    </div>
                                    <div className={"content"}>
                                        <h6>Desserts</h6>
                                        <p>8,15,856<span>30%</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className={"report-section-right"}>
                                <div className={"order-boxes-section"}>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportMade}
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportUnmade }
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportList}
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"order-boxes-section"}>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportCancel}
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportExchange}
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                    <div className={"order-boxes"}>
                                        <div className={"icon-box"}>
                                            {ReportRefund}
                                        </div>
                                        <div className={"content"}>
                                            <h6>Made</h6>
                                            <p>2581</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}