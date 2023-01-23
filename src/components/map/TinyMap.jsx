import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import useMediaQuery from '@mui/material/useMediaQuery';
import {CardMedia, CircularProgress} from "@mui/material";


function TinyMap(props) {
    const center = props.center
    //const center = [30,30]
    const showHQ = props.showHQ

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY
    const [loading, setLoading] = useState(true);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapCenter, setMapCenter] = useState(props.center.coordinates)
    //const [mapCenter, setMapCenter] = useState(props.center.coordinates)
    const [zoom, setZoom] = useState(14);
    const [language, setLanguage] = useState(new MapboxLanguage())
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');


    useEffect(() => {
        const renderMap = async () => {
            if (map.current) return
            map.current = await new mapboxgl.Map({
                container: mapContainer.current,
                //style: prefersDarkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: center.geocoordinates.coordinates,
                zoom: zoom,
                cooperativeGestures: true,
                attributionControl: false,
                localFontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            })
            map.current.addControl(language);


            if (props.showHQ) {
                const hqMarker = new mapboxgl.Marker({color: '#f7a700'})
                    .setLngLat([10.0186865,48.50576])
                    .setPopup(
                        new mapboxgl.Popup({offset: 25})
                            .setText('Headquaters')
                    )
                    .addTo(map.current)
            }

            const coordinateMarker = new mapboxgl.Marker({color: '#8c3434'})
                .setLngLat(center.geocoordinates.coordinates)
                .setPopup(
                    new mapboxgl.Popup({offset: 25})
                        .setText('Customer')
                )
                .addTo(map.current)


        }
        return renderMap
    }, [])

   useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setMapCenter(map.current.getCenter())
            //setLng(map.current.getCenter().lng.toFixed(4));
            //setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        })
    })

    return (
        <CardMedia sx={{ width: props.width}}>
          <div ref={mapContainer} style={{minHeight: '220px', height: '100%'}} />
        </CardMedia>
    );
}

TinyMap.propTypes = {
    //center: PropTypes.array.isRequired,
    showHQ: PropTypes.bool.isRequired
}

export default TinyMap;