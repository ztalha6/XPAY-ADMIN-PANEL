import React, {useEffect, useState} from "react"
import {Col, Form, Row} from "react-bootstrap";
import ThemeColorPicker from "../../../components/dashboard/ThemeColorPicker";
import {Controller, useForm} from "react-hook-form";
import {IGetCMS, IWebsiteCMS} from "../../../interfaces/ICMS";
import {Required} from "../../../utils/patterns";
import "../../../../assets/css/views/dashboard/website-cms.scss"
import ImageUpload from "../../../components/dashboard/ImageUpload";
import {BACKEND_CONSTANTS} from "../../../config/constants";
import {CmsServices} from "../../../services/api-services/cms.service";
import {toast} from "react-toastify";
import ThemeButton from "../../../components/dashboard/ThemeButton";
import {useNavigate} from "react-router-dom";

export default function MobileManagement() {
    const [cms,setCms] = useState<IGetCMS>()
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoader, setSubmitLoader] = useState<boolean>(false)

    const navigator = useNavigate()
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        control,
        watch
    } = useForm<IWebsiteCMS>({
        mode: "onChange",
    });

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

    const onSubmit= async(data:IWebsiteCMS)=>{
        setSubmitLoader(true)
        data.type = BACKEND_CONSTANTS.THEME_TYPES.MOBILE
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

    const getCms = async () => {
        setLoading(true)
        const result = await CmsServices.get({type:BACKEND_CONSTANTS.THEME_TYPES.MOBILE})
        if(result.status && result.data) {

            const cmsData = {
                primary_color: result.data.primary_color,
                secondary_color: result.data.secondary_color,
                logos : [
                    {
                        path: result.data?.app_logo?.path || ""
                    }
                ],
                banners: result.data?.app_banners?.map((banner)=> {
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
                        <div className={"dfields color-field"}>
                            <label>Primary Color</label>
                            <Controller
                                name="primary_color"
                                defaultValue={""}
                                control={control}
                                rules = {{required : Required}}
                                render={({ field }) => (
                                    <ThemeColorPicker value={cms?.primary_color}  setValue={setValue} fieldName={'primary_color'} picker={'GooglePicker'} popup={true} errors={errors.primary_color}/>
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
                            <ImageUpload maxCount={1} setValue={setValue} fieldName={"logos"} aspect={216/60} value={cms?.app_logo?.mediaUrl || null}/>
                        </div>

                        <div className={"dfields"}>
                            <label>Restaurant Banners</label>
                            <ImageUpload maxCount={1} setValue={setValue} fieldName={"banners"} aspect={16/9} value={cms?.app_banners?.[0]?.mediaUrl || null}/>
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