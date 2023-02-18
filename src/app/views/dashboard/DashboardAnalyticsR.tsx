import React, {useEffect, useState} from "react"
import {Col, Container, Form, Row} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";
import ThemeButton from "../../components/dashboard/ThemeButton";
import {IBarChartResult, IDashboardAnalytics, IDashboardAnalyticsParams, ITimeGraph} from "../../interfaces/IReports";
import moment from "moment";
import {useUserContext} from "../../providers/UserProvider";
import {BACKEND_CONSTANTS} from "../../config/constants";
import {ReportService} from "../../services/api-services/report.service";
import "../../../assets/css/views/dashboard/dashboard-analyticsr.scss"
import {IoStorefrontOutline} from "react-icons/io5"
import {Progress, Tabs} from "antd";
import {ExcelIcon} from "../../../assets/images/icons/menu-icons/performances";
import {RiEBike2Line, RiRestaurantLine} from "react-icons/ri"
import {TfiBarChart} from "react-icons/tfi"
import {AiOutlineLaptop} from "react-icons/ai"
import {FiUser} from "react-icons/fi";
import BarChart from "../../components/charts/BarChart";
import DashboardFilters from "./DashboardFilters";
import {FaFilter} from "react-icons/fa";
import ThemeModal from "../../components/Modal";
import DashboardHeatmap from "../../components/dashboard/HeatMap";
import DashboardAnalyticsSkeletons from "../../skeletons/DashboardAnalyticsSkeletons";

export default function DashboardAnalyticsR() {
    const { TabPane } = Tabs;
    const [analytics, setAnalytics] = useState<IDashboardAnalytics>();
    const [loading, setLoading] = useState<boolean>(false);
    const {setTitle, establishmentId} = useUserContext()

    function GroupByHour(data:IBarChartResult[],compareFrom: number) {
        // create a map of all possible hours
        let loopNumber = 0

        switch (compareFrom) {
            case BACKEND_CONSTANTS.COMPARED.FROM.TODAY:
                loopNumber = 24
                break;
            case BACKEND_CONSTANTS.COMPARED.FROM.THIS_WEEK:
                loopNumber = 7
                break;
            case BACKEND_CONSTANTS.COMPARED.FROM.THIS_MONTH:
                loopNumber = 31
                break;
            case BACKEND_CONSTANTS.COMPARED.FROM.THIS_YEAR:
                loopNumber = 12
                break;
        }

        const hourMap: { [label: number]: number } = {};
        for (let i = 1; i < loopNumber + 1; i++) {
            hourMap[i] = 0;
        }

        // group the data by hour
        data.forEach((item:IBarChartResult) => {
            hourMap[item.x_label] = item.net_amount;
        });

        // convert the map to an array
        const result: ITimeGraph[] = [];
        for (let hour in hourMap) {
            result.push({
                x_label: parseInt(hour),
                net_amount: hourMap[hour]
            });
        }

        return result;
    }

    const fetchData = async (data:IDashboardAnalyticsParams) => {
        setLoading(true);
        const res = await ReportService.dashboardAnalytics(data)
        setLoading(false);
        if(res.status){
            const dinein_data = res.data.bar_chart_result.filter((data)=> data.order_type == BACKEND_CONSTANTS.ORDERS.TYPES.DINE)
            const takeaway_data = res.data.bar_chart_result.filter((data)=> data.order_type == BACKEND_CONSTANTS.ORDERS.TYPES.TAKEAWAY)
            const delivery_data = res.data.bar_chart_result.filter((data)=> data.order_type == BACKEND_CONSTANTS.ORDERS.TYPES.DELIVERY)
            const online_data = res.data.bar_chart_result.filter((data)=> data.order_type == BACKEND_CONSTANTS.ORDERS.TYPES.ONLINE)

            const dinein_result = GroupByHour(dinein_data,data.compare_from)
            const takeaway_result = GroupByHour(takeaway_data,data.compare_from)
            const delivery_result = GroupByHour(delivery_data,data.compare_from)
            const online_result = GroupByHour(online_data,data.compare_from)

            const modifiedData = {
                ...res.data,
                dinein_result,
                takeaway_result,
                delivery_result,
                online_result
            }
            setAnalytics(modifiedData)
        }
    }

    useEffect(()=>{
        setTitle("Welcome To ServeEasy")
        if(establishmentId){
            fetchData({
                compare_to: BACKEND_CONSTANTS.COMPARED.FROM.TODAY,
                compare_from: BACKEND_CONSTANTS.COMPARED.TO.YESTERDAY,
                establishment_id: establishmentId,
                date: moment().format('YYYY-MM-DD')
            })
        }
    },[establishmentId])


    const methods = useForm<IDashboardAnalyticsParams>({
        shouldUnregister: false,
        mode: "onChange",
    });

    const onSubmit = async (data:IDashboardAnalyticsParams)=> {
        const analyticsParams:IDashboardAnalyticsParams = {
            ...data,
            establishment_id: establishmentId,
            date: moment().format('YYYY-MM-DD')
        }
        fetchData(analyticsParams)
    }

    const operations = <button className={"excel-btn btn"}>{ ExcelIcon} Export CSV</button>;

    // All Chart
    const labels = ['12pm', '1pm', '2pm', '3pm ', '4pm', '5pm', '6pm', '7pm', '8pm' , '9pm', '10pm', '11pm', '12am','1am' ,'2am' , '3am ', '4am', '5am', '6am', '7am', '8am' , '9am', '10am', '11am'];
    const AllChart = [
        {
            label: 'Dine-in',
            data: analytics?.dinein_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(252, 187, 54,0.9)'
        },
        {
            label: 'Takeaway',
            data: analytics?.takeaway_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(1, 120, 229,0.9)',

        },
        {
            label: 'Delivery',
            data: analytics?.delivery_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(110, 201, 168,0.9)'
        },
    ]
    const DineChart = [
        {
            label: 'Dine-in',
            data:  analytics?.dinein_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(110, 201, 168,0.9)',
        },
    ]
    const TakeawayChart = [
        {
            label: 'Take-away',
            data:  analytics?.takeaway_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(1, 120, 229,0.9)',
        },
    ]
    const DeliveryChart = [
        {
            label: 'Delivery',
            data: analytics?.delivery_result.map((data) => {
                return (
                    {
                        x: JSON.stringify(data.x_label),
                        y: data.net_amount
                    }
                )
            }),
            backgroundColor: 'rgba(110, 201, 168,0.9)',
        },
    ]
    const Linelabels = ['10-10-21', '11-10-21', '12-10-21', '13-10-21', '14-10-21' ,'15-10-21'];
    const LineCharts = [
        {
            label: 'Dine-in',
            data: [100,250,500,300,200,700],
            borderColor: 'rgba(252, 187, 54,0.9)',
            backgroundColor: 'rgba(252, 187, 54,0.9)',
        },
        {
            label: 'Takeaway',
            data: [400,200,100,500,400,300],
            borderColor: 'rgba(1, 120, 229,0.9)',
            backgroundColor: 'rgba(1, 120, 229,0.9)',
        },
        {
            label: 'Delivery',
            data: [300,400,600,400,300,200],
            borderColor: 'rgba(110, 201, 168,0.9)',
            backgroundColor: 'rgba(110, 201, 168,0.9)',
        },
    ]
    const Polarlabels = ['Dine-in', 'Takeaway', 'Delivery', 'Online'];
    const PolarCharts = [
        {
            label: '# of Votes',
            data: [10, 8, 9, 8,],
            backgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
            ],
        },
    ]
    // Popup
    const [filterPopup, setFilterPopup] = useState<boolean>(false);
    const filterModal =()=> {
        setFilterPopup(true)
    }
    return(
        <div className={"dashboard-analyticsr"}>
            <Container fluid>
                <div className={"dashboard-filter"}>
                    <FormProvider  {...methods}>
                        <Form onSubmit={methods.handleSubmit(onSubmit)} >
                            <Row>
                                <div  className={"d-block d-md-none"}>
                                    <div className={""}>
                                        <ThemeButton onClick={()=>{filterModal()}} className={"filter-popup-btn"} text={"Filter"} type={"button"} suffixIcon={<FaFilter/>}/>
                                        <ThemeModal title={'Filters'} active={filterPopup} setActive={setFilterPopup} children={ <DashboardFilters loading={loading}/>} />
                                    </div>
                                </div>
                                <div className={"d-none d-md-block"}>
                                    <DashboardFilters loading={loading}/>
                                </div>
                            </Row>
                        </Form>
                    </FormProvider>
                </div>
                {!loading ?
                    <Row>
                        <Col className={"order-lg-1 order-md-1"} md={6} lg={4}>
                            <div className={"chart-card"}>
                                <div className={"progress-chart"}>
                                    <h4>
                                        <span>Monthly Sales Target 3,000,000</span>
                                    </h4>
                                    <div className={"p-chart"}>
                                        <Progress width={250} strokeColor={'#0178e5'} type="circle" strokeWidth={8} percent={25} format={percent => {
                                            return (
                                                <>
                                                    <h5 className={"chart-text"}>Target Achieved</h5>
                                                    <span className={"chart-percent"}>{percent} <small>%</small></span>
                                                </>
                                            )
                                        }} />
                                    </div>
                                    <div className={"progress-chart-target"}>
                                        <ul>
                                            <li>
                                                <h4>Today's Sales <span className={"t-sales"}>$65</span></h4>
                                                {/*<div className={"box up"}>*/}
                                                {/*    <div className={"box-icon"}>*/}
                                                {/*        {DashStatGreen}*/}
                                                {/*    </div>*/}
                                                {/*    <div className={"box-detail"}>*/}
                                                {/*        <h4>Today’s Sale</h4>*/}
                                                {/*        <p>{analytics?.all_sales_net_amount.current}</p>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </li>
                                            <li>
                                                <h4>Daily Target <span className={"d-target"}>$155</span></h4>
                                                {/*<div className={"box down "}>*/}
                                                {/*    <div className={"box-icon"}>*/}
                                                {/*        {DashStatRed}*/}
                                                {/*    </div>*/}
                                                {/*    <div className={"box-detail"}>*/}
                                                {/*        <h4>Rqd. sales per day </h4>*/}
                                                {/*        <p>{analytics?.all_sales_net_amount.past}</p>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </li>

                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </Col>
                        <Col className={"order-lg-1 order-md-2"} md={6} lg={4}>
                            <div className={"stats-card-2"}>
                                <div className={"stats-icon  dine-in"}>
                                    <RiRestaurantLine/>
                                </div>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.dinein_net_amount?.current || 0}</h4>
                                    <h5>Dine in</h5>
                                </div>
                            </div>
                            <div className={"stats-card-2"}>
                                <div className={"stats-icon online"}>
                                    <AiOutlineLaptop/>
                                </div>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.online_net_amount?.current || 0}</h4>
                                    <h5>Online</h5>
                                </div>
                            </div>
                            <div className={"stats-card"}>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.net_amount.current}</h4>
                                    <h5>Total Sales</h5>
                                </div>
                                <div className={"stats-icon"}>
                                    <TfiBarChart/>
                                </div>
                            </div>
                            <div className={"stats-card"}>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.net_amount.past}</h4>
                                    <h5>Yesterday's Sales</h5>
                                </div>
                                <div className={"stats-icon"}>
                                    <TfiBarChart/>
                                </div>
                            </div>
                        </Col>
                        <Col className={"order-lg-3 order-md-3"} md={6} lg={4}>
                            <div className={"stats-card-2"}>
                                <div className={"stats-icon take-away"}>
                                    <IoStorefrontOutline/>
                                </div>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.takeaway_net_amount?.current || 0}</h4>
                                    <h5>Take away</h5>
                                </div>
                            </div>
                            <div className={"stats-card-2"}>
                                <div className={"stats-icon  delivery"}>
                                    <RiEBike2Line/>
                                </div>
                                <div className={"stats-content"}>
                                    <h4>{analytics?.delivery_net_amount?.current || 0}</h4>
                                    <h5>Delivery</h5>
                                </div>
                            </div>
                            <div className={"visitor-count"}>
                                <h3>Visitors Comparison</h3>
                                <ul>
                                    <li><span>Android</span> <span className={"number"}><FiUser/>{analytics?.android_platform_orders.current || 0}</span></li>
                                    <li><span>Ios</span> <span className={"number"}><FiUser/>{analytics?.ios_platform_orders.current || 0}</span></li>
                                    <li><span>Desktop</span> <span className={"number"}><FiUser/>{analytics?.desktop_platform_orders.current || 0}</span></li>
                                    <li><span>Pos</span> <span className={"number"}><FiUser/>{analytics?.pos_platform_orders.current || 0}</span></li>
                                </ul>
                            </div>
                        </Col>
                        <Col className={"order-lg-4 order-md-5"} md={12} lg={8}>
                            <div className={"theme-tabs"}>
                                <div className={"guest-card"}>
                                    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
                                        <TabPane tab="All" key="1">
                                            <Row>
                                                <Col md={12}>
                                                    <div className={'mapdiv'}>
                                                        <BarChart dataSets={AllChart}/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="Dine-in" key="2">
                                            <Row>
                                                <Col md={12}>
                                                    <BarChart  dataSets={DineChart}/>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="Takeaway" key="3">
                                            <Row>
                                                <Col md={12}>
                                                    <BarChart  dataSets={TakeawayChart}/>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="Delivery" key="4">
                                            <Row>
                                                <Col md={12}>
                                                    <BarChart  dataSets={DeliveryChart}/>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                        {/*<Col className={"order-lg-5 order-md-4"} md={6} lg={4}>*/}
                        {/*    <div className={"category-chart"}>*/}
                        {/*        <h4><span>Top Selling Products</span><span>Net Sales</span></h4>*/}
                        {/*        <div className={"category-list"}>*/}
                        {/*            <ul>*/}
                        {/*                {analytics?.product_sales_breakdown.map((data:IProductSaleBreakdown)=> {*/}
                        {/*                    return (*/}
                        {/*                        <li>*/}
                        {/*                            <div>{data.product.name}</div>*/}
                        {/*                            <div className={"stats-box"}>*/}
                        {/*                                /!*<span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                        {/*                                <span>{data.meta.sale}</span>*/}
                        {/*                            </div>*/}
                        {/*                        </li>*/}
                        {/*                    )*/}
                        {/*                })}*/}
                        {/*            </ul>*/}
                        {/*        </div>*/}

                        {/*    </div>*/}
                        {/*</Col>*/}
                        <Col className={"order-lg-5 order-md-4"} md={6} lg={4}>
                            {/*<div className={"category-list"}>*/}
                            {/*    <ul>*/}
                            {/*        {analytics?.product_sales_breakdown.map((data:IProductSaleBreakdown, index)=> {*/}
                            {/*            return (*/}
                            {/*                <li key={index} >*/}
                            {/*                    <div>{data.product.name}</div>*/}
                            {/*                    <div className={"stats-box"}>*/}
                            {/*/!*<span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*                        <span>{data.meta.sale}</span>*/}
                            {/*                    </div>*/}
                            {/*                </li>*/}
                            {/*            )*/}
                            {/*        })}*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats down"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats down"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*/!*<li>*!/*/}
                            {/*    /!*    <div>Beef Burger</div>*!/*/}
                            {/*    /!*    <div className={"stats-box"}>*!/*/}
                            {/*        /!*        <span className={"stats up"}><IoMdArrowDropdown/>30%</span>*!/*/}
                            {/*        /!*        <span>4210</span>*!/*/}
                            {/*    /!*    </div>*!/*/}
                            {/*/!*</li>*!/*/}
                            {/*    </ul>*/}
                            {/*</div>*/}
                            <div className={"category-chart"}>
                                <DashboardHeatmap data={analytics?.heat_map_result} />
                            </div>
                        </Col>
                    </Row>
                    :
                    <DashboardAnalyticsSkeletons/>
                }

            </Container>
        </div>
    )
}