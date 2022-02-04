import React from 'react';
import { useEffect } from 'react'
import './Map.scss';

const Map = React.memo(function Map({ ymaps, setPolyline, setMap }) {
    useEffect(() => {
        // console.log(ymaps);
        
          async  function loadMap(o) {
                try{
                ymaps.ready(init);
            
        } catch(e){
            // console.log(e);
            if(!o){
                alert("Error loading")
            }
            await setTimeout( ()=>{loadMap(true)}	, 3000)
           

        }}
       loadMap();
        
    })
    // useEffect(() => {
    //     console.log(2);
    //     setMap(map);
    // }, [myMap])
    let map;
    let polyline;
    function init() {
        map = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 7
        });
        // console.log('setMap',);
        polyline =new ymaps.Polyline([
           
        ])
        map.geoObjects.add(polyline);
        setMap(map);
        setPolyline(polyline);
    }

    return (
        <div className="map" id="map" ></div>
    );
},
    function areEqual() {
        return true;
    })
export default Map;