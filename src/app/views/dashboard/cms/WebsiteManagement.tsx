import React, {useEffect, useState} from "react"
import {Col, Form, Row} from "react-bootstrap";
import {ColorPickerValue} from 'antd-colorpicker'
// import {Form} from "antd";
import ThemeColorPicker from "../../../components/dashboard/ThemeColorPicker";
import {Controller, useForm} from "react-hook-form";
import {IGetCMS, IWebsiteCMS} from "../../../interfaces/ICMS";
import {Required} from "../../../utils/patterns";
import "../../../../assets/css/views/dashboard/website-cms.scss"
import ImageUpload from "../../../components/dashboard/ImageUpload";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {toast} from "react-toastify";
import {CmsServices} from "../../../services/api-services/cms.service";
import {useNavigate} from "react-router-dom";
import ThemeButton from "../../../components/dashboard/ThemeButton";

export default function WebsiteManagement() {
    const navigator = useNavigate()
    const initialValues = { color: { r: 26, g: 14, b: 85, a: 1 } }
    const handleOnFinish = (values: { color: ColorPickerValue }) => {
        console.log(values)
    }

    const [cms,setCms] = useState<IGetCMS>()
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoader, setSubmitLoader] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
        control,
        watch
    } = useForm<IWebsiteCMS>({
        mode: "onChange",
    });

    const onSubmit= async(data:IWebsiteCMS)=>{
        setSubmitLoader(true)
        data.type = BACKEND_CONSTANTS.THEME_TYPES.WEB
        if(data.logos){
            data.logo = data.logos[0].path
        }
        delete data.logos
        const res = await CmsServices.store(data)
        if(res.status){
            toast.success(res.message)
        }
        setSubmitLoader(false)
    }

    const fonts = [
        {
            id: 1,
            name:'Poppins'
        },
        {
            id: 3,
            name:'Playfair'
        },
        {
            id: 4,
            name:'Inter'
        },
        {
            id: 5,
            name:'Opens'
        },
    ]

    const getCms = async () => {
        setLoading(true)
        const result = await CmsServices.get({type:BACKEND_CONSTANTS.THEME_TYPES.WEB})
        if(result.status && result.data) {

            const cmsData = {
                primary_color: result.data.primary_color,
                secondary_color: result.data.secondary_color,
                logos : [
                    {
                        path: result.data?.web_logo?.path || ""
                    }
                ],
                banners: result.data?.web_banners?.map((banner)=> {
                    return {
                        path: banner.path
                    }
                })
            }

            setCms(result.data)
            reset(cmsData)
        }
        setLoading(false)
    }

    useEffect(() => {
        getCms()
    }, []);

    return(
        <div className={"website-cms"}>
            <Row>
                <Col md={5}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/*<Form.Item label={'Colorpicker'} name={`color`}>*/}
                        {/*    <Colorpicker picker={'ChromePicker'} popup />*/}
                        {/*</Form.Item>*/}

                        {/*<ThemeColorPicker picker={'ChromePicker'} popup={true}/>*/}
                        <div className={"dfields color-field"}>
                            <label>Primary Color</label>
                            <Controller
                                name="primary_color"
                                defaultValue={""}
                                control={control}
                                rules = {{required : Required}}
                                render={({ field }) => (
                                    <ThemeColorPicker value={cms?.primary_color} setValue={setValue} fieldName={'primary_color'} picker={'GooglePicker'} popup={true} errors={errors.primary_color}/>
                                )}
                            />
                        </div>

                        <div className={"dfields color-field"}>
                            <label>Secondary Color</label>
                            <Controller
                                name="secondary_color"
                                defaultValue={""}
                                control={control}
                                rules = {{required : Required}}
                                render={({ field }) => (
                                    <ThemeColorPicker value={cms?.secondary_color} setValue={setValue} fieldName={'secondary_color'}  picker={'GooglePicker'} popup={true} errors={errors.secondary_color}/>
                                )}
                            />
                        </div>

                        <div className={"dfields"}>
                            <label>Restaurant Logo</label>
                            <ImageUpload maxCount={1} setValue={setValue} fieldName={"logos"} aspect={216/60} value={cms?.web_logo?.mediaUrl || null}/>
                        </div>

                        <div className={"dfields"}>
                            <label>Restaurant Banners</label>
                            <ImageUpload maxCount={3} setValue={setValue} fieldName={"banners"} aspect={1567/443} value={cms?.web_banners || []} getValues={getValues} />
                        </div>
                        {/*<div className={"dfields"}>*/}
                        {/*    <Controller*/}
                        {/*        name="font"*/}
                        {/*        defaultValue={0}*/}
                        {/*        control={control}*/}
                        {/*        rules = {{required : Required}}*/}
                        {/*        render={({ field }) => (*/}
                        {/*            <SelectField*/}
                        {/*                defaultValue={0}*/}
                        {/*                label={"Fonts"}*/}
                        {/*                errors={errors.font}*/}
                        {/*                field = {field}*/}
                        {/*                selectOptions = {fonts}*/}
                        {/*                // disabled={!isRestaurantAdmin}*/}
                        {/*            />*/}
                        {/*        )}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className={"button-section"}>
                            <ThemeButton onClick={()=>  navigator(-1)} type={"button"} className={"form-cancel"} text={"Cancel"}/>
                            <ThemeButton loader={submitLoader} type={"submit"} className={"form-create"} text={"Save"}/>
                        </div>
                    </Form>

                </Col>
                <Col md={7}>
                </Col>
            </Row>
        </div>
    )
}