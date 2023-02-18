import React, {useState} from 'react';
import "../../../assets/css/components/dashboard/notificationdropdown.scss";
import {AiOutlineBell} from "react-icons/ai";
import {IHeaderDropdown} from "../../interfaces/IHeaderDropdown";
import {Popover} from "antd";
import NotificationList from "./NotificationList";

export default function NotificationDropdown({dropdown , setDropdown}: IHeaderDropdown) {
    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    function dropdownHandle() {
        setDropdown({
            notification: !dropdown,
            profile: false
        });
    }

    return(
        <Popover
            content={<NotificationList />}
            title={null}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
        <div className="notification-dropdown">
            <div className={`drop-down`}>
                <div onClick={dropdownHandle} id="dropDown" className="drop-down__button">
                    <div className={"notification-icon"}>
                        <AiOutlineBell/>
                        {/*todo: add counter */}
                    </div>
                </div>
            </div>
        </div>
        </Popover>
    );
}