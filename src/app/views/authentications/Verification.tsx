import React, {useState} from "react";
import Logosmall from "../../../assets/images/logosmall.svg";
import {Form} from "react-bootstrap";
import ThemeBtn from "../../components/authentication/ThemeBtn";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import {success} from "../../utils/message";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Count Downn
import {message, Statistic} from 'antd';
import OtpInput from 'react-otp-input';
//css
import "../../../assets/css/components/authentication/otp-field.scss"

export default function Verification() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });
    const [otpCode, setOtpCode] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const onSubmit=(data:object)=>{
        if (otpCode.length === 0) {
            setError(true)
            setErrorMessage("Please Enter OTP code")
        }
        else if (otpCode.length > 0 && otpCode.length < 3) {
            setError(true)
            setErrorMessage("OTP code is incomplete")
        }
        else {
            setError(false)
            success("OTP verified")
            console.log(data);
            setTimeout(() => {
                navigate("/reset-password")
            }, 2000)
        }
    }
    const handleOtpChange = (otp:string) => {
        if (otpCode.length <= 0) {
            setError(true)
            setErrorMessage("Please Enter OTP code")
        }
        else if (otpCode.length > 0 && otpCode.length < 3) {
            setError(true)
            setErrorMessage("OTP code is incomplete")
        }
        else {
            setError(false)
        }
        setOtpCode(otp);
    }

    const [otpDisable, setOtpDisable] = useState<boolean>(false);
    const [deadline, setdeadline] = useState<number>(Date.now() + 1000 * 60);
    const { Countdown } = Statistic;
    const onFinish =()=>{
        setOtpDisable(true);
    }
    const RequestOtp =()=>{
        message.loading({ content: 'Sending OTP...' ,duration: 1});
        setTimeout(() => {
            message.success({ content: 'OTP sent to provided email',duration: 1 });
        }, 1000);
        setOtpCode('');
        setOtpDisable(false);
        setdeadline(Date.now() + 1000 * 60);
    }
    return(
        <div className={"verification"}>
            <div className="Login-form">
                <div className="login-content">
                    <img className="img-fluid mt-3 mb-3" src={Logosmall} />
                    <h3>OTP VERIFICATION</h3>
                    <p>
                        Check your email. We've sent you the PIN
                        at jo****@***mail.com
                    </p>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

                    <div className={"otp-field"}>
                        <Countdown title="Otp Expire After " value={deadline} format="ss" onFinish={onFinish}  />
                        <OtpInput
                            value={otpCode}
                            onChange={(otp:string)=>handleOtpChange(otp)}
                            numInputs={4}
                            isInputNum={true}
                            placeholder={"----"}
                            className={"OtpInput"}
                            hasErrored={true}
                            focusStyle="focus"
                            isDisabled={otpDisable}
                        />

                        {error && <div className={"validation-error"} role="alert">{errorMessage}</div>}
                        <p>Didn't Get Code ? <a onClick={RequestOtp}> Request Again</a></p>
                    </div>

                    <div className="login-btns mt-3">
                        <ThemeBtn
                            type={"submit"}
                            text={"Submit"}
                            variant={"primary"}
                        />
                    </div>
                </Form>
            </div>
        </div>
    )
}