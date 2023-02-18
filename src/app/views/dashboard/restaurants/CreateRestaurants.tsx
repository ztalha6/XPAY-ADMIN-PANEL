import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextInput from "../../../components/authentication/TextInput";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {EmailValidation, maxLength, minLength, PhoneValidation, Required} from "../../../utils/patterns";
import ViewCard from "../../../components/dashboard/ViewCard";
import "../../../../assets/css/views/dashboard/create-restaurant.scss"
import ThemeDatePicker from "../../../components/dashboard/ThemeDatePicker";
import {ICreateRestaurant} from "../../../interfaces/IRestaurant";
import EmailInput from "../../../components/authentication/EmailInput";
import PhoneInput from "../../../components/authentication/PhoneInput";
import PasswordInput from "../../../components/authentication/PasswordInput";
import {AiFillEye, AiOutlineEyeInvisible} from "react-icons/ai";
import SelectField from "../../../components/dashboard/SelectField";
import {RestaurantService} from "../../../services/api-services/restaurant.service";
import {toast} from "react-toastify";
import {IPlanList} from "../../../interfaces/IPlan";
import {PlanService} from "../../../services/api-services/plan.service";
import {useNavigate} from "react-router";
import {useUserContext} from "../../../providers/UserProvider";
import ThemeButton from "../../../components/dashboard/ThemeButton";


export default function CreateRestaurants() {
    const {setTitle} = useUserContext()
    useEffect(()=>{
        setTitle("Create Restaurant")
    })
    const [smtpPassword, setSmtpPassword] = useState<boolean>(true);
    const [sqlPassword, setSqlPassword] = useState<boolean>(true);
    const [plans , setPlans] = useState<IPlanList[]>([])
    const navigator = useNavigate()
    const methods = useForm<ICreateRestaurant>({
        shouldUnregister: false,
        mode: "onChange",
    });

    const onSubmit = async (data:ICreateRestaurant)=>{
        // console.log(data)
        const res = await RestaurantService.store(data)
        if(res.status){
            toast.success(res.message)
            navigator(  `/restaurants`)
            methods.reset();
        }
    }

    const gateway = [
        {
            id: 10,
            name:'Stripe'
        },
        {
            id:20,
            name:'Paytabs',
        },
    ]

    const status = [
        {
            id: 10,
            name:'Active'
        },
        {
            id:20,
            name:'In Active',
        },
    ]



    useEffect(()=>{

        /*Fetch All Printers*/
        PlanService.all().then((res)=>{
            setPlans(res.data)
        })
    },[])

    return(
        <ViewCard>
            <div className={"create-restaurant"}>
                <FormProvider {...methods}>
                    <Form onSubmit={methods.handleSubmit(onSubmit)}>
                            <Row className={"h-100"}>
                                <Col md={12}>
                                    <h2 className={"dash-heading"}>Create Restaurant</h2>
                                </Col>
                                {/*<Col md={4}>*/}
                                {/*    <div className={"dfields establishment-fields"}>*/}
                                {/*        <input type="hidden" value={20.34334} {...methods.register("latitude")}/>*/}
                                {/*        <input type="hidden" value={10.34234} {...methods.register("longitude")}/>*/}
                                {/*    </div>*/}
                                {/*</Col>*/}
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="name"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={" Name"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.name}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="established_date"
                                            control={methods.control}
                                            rules={{required:Required}}
                                            render={({ field:{name} }) => (
                                                <ThemeDatePicker
                                                    setValue={methods.setValue}
                                                    fieldName={name}
                                                    label={"Established Date"}
                                                    size={'large'}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="no_of_employees"
                                            defaultValue={0}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(1), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"No of Employees"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"number"}
                                                    field={field}
                                                    errors ={methods.formState.errors.no_of_employees}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="no_of_establishments"
                                            defaultValue={0}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(1), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"No of Establishment"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"number"}
                                                    field={field}
                                                    errors ={methods.formState.errors.no_of_establishments}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name={"status"}
                                            defaultValue={10}
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SelectField
                                                    defaultValue={10}
                                                    label={"Status"}
                                                    errors ={methods.formState.errors.status}
                                                    field = {field}
                                                    selectOptions = {status}
                                                    // setSelectedEstablishment = {setSelectedEstablishment}
                                                    disabled={false}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="subscription_id"
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(1), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <SelectField
                                                    label={"Select Subscription"}
                                                    errors={methods.formState.errors.subscription_id}
                                                    field = {field}
                                                    selectOptions = {plans}
                                                    disabled={false}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="owner_name"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"Owner Name"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.owner_name}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="email"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, pattern:EmailValidation}}
                                            render={({ field }) => (
                                                <EmailInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"Email"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.email}
                                                />
                                            )}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="phone"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, pattern:PhoneValidation}}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"Phone"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.phone}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className={"dfields crestaurant-fields"}>
                                        <Controller
                                            name="address"
                                            defaultValue={""}
                                            control={methods.control}
                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                            render={({ field }) => (
                                                <TextInput
                                                    placeholder={""}
                                                    variant={"field-white"}
                                                    label={"Address"}
                                                    labelPos={"out"}
                                                    labelColor={"dark"}
                                                    type={"text"}
                                                    field={field}
                                                    errors ={methods.formState.errors.address}
                                                />
                                            )}
                                        />

                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <Col md={12}>
                                    <div className={"settings"}>
                                        <Row>
                                            <Col md={12}>
                                                <h3>Settings</h3>
                                            </Col>
                                        </Row>
                                        <div className={"setting-section"}>
                                            <Row>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.payment_gateway"
                                                            defaultValue={10}
                                                            control={methods.control}
                                                            render={({ field }) => (
                                                                <SelectField
                                                                    defaultValue={10}
                                                                    label={"Payment Gateway"}
                                                                    errors={methods.formState?.errors?.setting?.payment_gateway}
                                                                    field = {field}
                                                                    selectOptions = {gateway}
                                                                    // setSelectedEstablishment = {setSelectedEstablishment}
                                                                    disabled={false}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name={`setting.payment_secret_key`}
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"Payment Secret Key"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.payment_secret_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.payment_publish_key"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"Payment Publish Key"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.payment_publish_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.s3_end_point"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"S3 End Point"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.s3_end_point}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.s3_secret_key"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"S3 Secret Key"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.s3_secret_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.s3_bucket_name"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"S3 Bucket Name"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.s3_bucket_name}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.s3_region"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"S3 Region"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.s3_region}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.s3_access_key_id"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"S3 Access Key Id "}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.s3_access_key_id}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.fcm_key"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"FCM Key"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.fcm_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.social_google_key"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"Social Google Key "}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.social_google_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.social_facebook_key"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"Social Facebook Key "}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.social_facebook_key}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.smtp_user"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required, minLength:minLength(3), maxLength:maxLength(50)}}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    placeholder={""}
                                                                    variant={"field-white"}
                                                                    label={"Smtp User"}
                                                                    labelPos={"out"}
                                                                    labelColor={"dark"}
                                                                    type={"text"}
                                                                    field={field}
                                                                    errors ={methods.formState?.errors?.setting?.smtp_user}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className={"dfields crestaurant-fields"}>
                                                        <Controller
                                                            name="setting.smtp_password"
                                                            defaultValue={""}
                                                            control={methods.control}
                                                            rules = {{required : Required}}
                                                            render={({ field }) => (
                                                                <PasswordInput
                                                                    variant={"field-white"}
                                                                    labelColor="dark"
                                                                    label={"Smtp Password"}
                                                                    type={"password"}
                                                                    labelPos={"out"}
                                                                    placeholder={"Password"}
                                                                    successIcon={<AiFillEye />}
                                                                    errorIcon={<AiOutlineEyeInvisible />}
                                                                    showPassword={smtpPassword}
                                                                    setShowPassword={setSmtpPassword}
                                                                    errors ={methods.formState?.errors?.setting?.smtp_password}
                                                                    field={field}

                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className={"mb-4"} md={12}>
                                    {/*<div className={"estab-bts"}>*/}
                                    {/*    <ThemeBtn size={"lg"} text={"Cancel"} type={"button"}/>*/}
                                    {/*    <ThemeBtn size={"lg"} text={"Create"} type={"submit"}/>*/}
                                    {/*    */}
                                    {/*</div>*/}
                                    <div className={"button-section"}>
                                        <ThemeButton onClick={()=>  navigator(-1)} type={"button"} className={"form-cancel"} text={"Cancel"}/>
                                        <ThemeButton type={"submit"} className={"form-create"} text={"Create"}/>
                                    </div>
                                </Col>
                            </Row>
                    </Form>
                </FormProvider>
            </div>
        </ViewCard>


    );
}