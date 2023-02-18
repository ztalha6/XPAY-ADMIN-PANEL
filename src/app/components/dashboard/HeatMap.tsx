import React, {useEffect, useRef} from 'react';
import {IHeatMap} from "../../interfaces/IReports";
import {useUserContext} from "../../providers/UserProvider";
import {Skeleton} from "antd";

function DashboardHeatmap(
    {data}:{
        data: IHeatMap[] | undefined
    }) {
    const ref = useRef<HTMLDivElement>(null);
    const { establishments, establishmentId } = useUserContext();
    const currentEstablishment = establishments.find(establishment=> establishment.id === establishmentId) ||
        {latitude:0, longitude:0};
    useEffect(()=>{
        initializeMap(data)
    }, [data]);

    const initializeMap = (orders: IHeatMap[] | undefined)=> {
        let heatMapData = orders?.map(order=>
            new google.maps.LatLng(order.lat, order.lng))

        let centerLocation = new window.google.maps.LatLng(currentEstablishment.latitude, currentEstablishment.longitude);

        if(ref.current) {
            let map = new window.google.maps.Map(ref.current, {
                center: centerLocation,
                zoom: 7,
            });
            let heatmap = new window.google.maps.visualization.HeatmapLayer({
                data: heatMapData || []
            });
            heatmap.setMap(map);
        }
    }
    if(!establishmentId || establishments.length === 0){
        return(
                <Skeleton.Image active={true} style={{height:"100%", width:"100%"}} />
        )
    }
    return <div ref={ref} id="map" className={"heat-map"} />
}
export default  DashboardHeatmap;