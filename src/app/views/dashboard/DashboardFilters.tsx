import React, {useEffect, useState} from "react"
import {Col, Form, Row} from "react-bootstrap";
import {Controller, useFormContext} from "react-hook-form";
import SelectField from "../../components/dashboard/SelectField";
import {BsCalendarDate} from "react-icons/bs";
import ThemeButton from "../../components/dashboard/ThemeButton";
import {IDealComboFilters} from "../../interfaces/IDealsCombo";
import {BACKEND_CONSTANTS} from "../../config/constants";
import {IDashboardAnalyticsParams} from "../../interfaces/IReports";




export default function DashboardFilters({loading}:{loading:boolean}) {
    const {
        control,
        setValue,
        register,
        watch,
        formState: { errors } } = useFormContext<IDashboardAnalyticsParams>();
    const comparedFrom = [
        {
            id: BACKEND_CONSTANTS.COMPARED.FROM.TODAY,
            name: 'Today',
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.FROM.THIS_WEEK,
            name: 'This Week'
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.FROM.THIS_MONTH,
            name: 'This Month'
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.FROM.THIS_YEAR,
            name: 'This Year'
        }
    ]
    interface ICompared {
        id:number,
        disabled : boolean,
        name: string
    }
    const compareTo:ICompared[]= [
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.YESTERDAY,
            name: 'Yesterday',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.LAST_WEEK,
            name: 'Last Week',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.LAST_MONTH,
            name: 'Last Month',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.LAST_YEAR,
            name: 'Last Year',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.SAME_DAY_LAST_WEEK,
            name: 'Same day last week',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.SAME_DAY_LAST_MONTH,
            name: 'Same day last month',
            disabled:false
        },
        {
            id: BACKEND_CONSTANTS.COMPARED.TO.SAME_DAY_LAST_YEAR,
            name: 'Same day last year',
            disabled:false
        },
    ]
    const toggleCompared = (data:number[], index:number)=>{
        setCompared(
            compared.map((innerData:ICompared)=> {
                if(data.find((id)=> innerData.id == id)){
                    return {
                        id: innerData.id,
                        name: innerData.name,
                        disabled: true
                    }
                }else {
                    return {
                        id: innerData.id,
                        name: innerData.name,
                        disabled: false
                    }

                }
            })
        )
    }
    const watchCompared = watch("compare_from", undefined);
    useEffect(()=>{
        console.log(typeof watchCompared , 'after change')
        if(watchCompared == 10){
            toggleCompared([20,30,40] , 0)
        }
        if(watchCompared == 20){
            toggleCompared([10,30,40, 50, 60 ,70] , 0)
        }
        if(watchCompared == 30){
            toggleCompared([10,20,40,50,60,70] , 0)
        }
        if(watchCompared == 40){
            toggleCompared([10,20,30,50,60,70] , 0)
        }
        // console.log(compared)
        // console.log(watchAppliesTo, 'watchmy', typeof watchAppliesTo)
    },[watchCompared])

    const [compared, setCompared] = useState<ICompared[]>(compareTo)
    return(
        <Row>
            <Col md={3} lg={3} xl={3} xxl={2} >
                <div className={"dfields filter-fields"}>
                    <Controller
                        name="compare_from"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                errors={errors.compare_from}
                                field = {field}
                                prefixIcon={<BsCalendarDate/>}
                                selectOptions={comparedFrom}
                            />
                        )}
                    />
                </div>
            </Col>
            <Col className={"d-flex"} md={2} lg={2} xl={2} xxl={1}>
                <span className={"compare-span m-auto"}>Compared To</span>
            </Col>
            <Col md={3} lg={3} xl={3} xxl={2}>
                <div className={"dfields filter-fields"}>
                    <Controller
                        name="compare_to"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                errors={errors.compare_to}
                                field = {field}
                                selectOptions={compared}
                                prefixIcon={<BsCalendarDate/>}
                            />
                        )}
                    />
                </div>

            </Col>
            <Col className={"d-flex align-items-end"} md={3} lg={3} xl={3} xxl={2}>
                <ThemeButton className={"filter-btn"} text={"Filter"} type={"submit"} loader={loading}/>
            </Col>
        </Row>
    )
}