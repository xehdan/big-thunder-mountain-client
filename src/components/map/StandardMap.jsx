import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language'
//import axios from "axios";
import useMediaQuery from '@mui/material/useMediaQuery';

function StandardMap(props) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY

    const mapContainer = useRef(null);
    const map = useRef(null);
    // 48.50576,10.0186865
    //const [lng, setLng] = useState(props.mapCenter[0]);
    //const [lat, setLat] = useState(props.mapCenter[1]);
    //const [newMapCenter, setNewMapCenter] = useState(props.NewMapCenter)
    const [mapCenter, setMapCenter] = useState(props.mapCenter)
    const [zoom, setZoom] = useState(7);
    // eslint-disable-next-line no-unused-vars
    const [language, setLanguage] = useState(new MapboxLanguage())
    // eslint-disable-next-line no-unused-vars
    const [markers, setMarkers] = useState(props.markers)
    // eslint-disable-next-line no-unused-vars
    const [newMapCenter, setNewMapCenter] = useState(props.mapCenter)

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');

    useEffect( () => {
        const renderMap = async() => {
            if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: prefersDarkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10',
                center: mapCenter,
                zoom: zoom,
                cooperativeGestures: true,
                attributionControl: false,
                localFontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            });
            map.current.addControl(language);
            map.current.addControl(new mapboxgl.NavigationControl())

            function fetchMarkers() {
                for (let markersKey in markers) {
                    const marker = markers[markersKey]
                    try {
                        // eslint-disable-next-line no-unused-vars
                        const markers = new mapboxgl.Marker({
                            color: marker.color
                        })
                            .setLngLat([marker.coordinates[0], marker.coordinates[1]])
                            .setPopup(
                                new mapboxgl.Popup({offset: 25}) // add popups <p>${street}<br/>${zipcode}, ${city}</p>`
                                    .setHTML(
                                        `<h3>${marker.name}</h3>`
                                    )
                            )
                            .addTo(map.current)
                    } catch (e) {
                        console.error(e)
                    }

                }
            }


            fetchMarkers()

            // Show Headquaters
            if (props.showHQ) {
                // eslint-disable-next-line no-unused-vars
                const hqMarker = new mapboxgl.Marker({color: '#f7a700'})
                    .setLngLat([10.0186865,48.50576])
                    .setPopup(
                        new mapboxgl.Popup({offset: 25})
                            .setText('Headquaters')
                    )
                    .addTo(map.current)
            }
        }
        return renderMap
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setMapCenter(map.current.getCenter())
            //setLng(map.current.getCenter().lng.toFixed(4));
            //setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        })
    })

    useEffect(() => {
        if (!map.current) return;
        if (props.chosenFlyToCenter === null) {
            console.log("True")
            return;
        }
        map.current.flyTo({
            center: props.chosenFlyToCenter,
            zoom: 11,
            speed: 2,
            curve: 1,
            easing(t) {
                return t;
            }})

    }, [props.chosenFlyToCenter])


    return (
        <>
            <div ref={mapContainer} style={{ minHeight: props.height, height: '100%'}} />
            {/*<Button onClick={() => goTo(props.chosenFlyToCenter)} >Go to {props.chosenFlyToCenter}</Button>*/}
        </>
    );
}


                /*
                async function fetchData() {
                                for (let markersKey in props.markers) {

                                    const name = props.markers[markersKey].name
                                    const street = props.markers[markersKey].street
                                    const zipcode = props.markers[markersKey].zipcode
                                    const city = props.markers[markersKey].city

                                    let coordinates
                                    let resp

                                    let lng
                                    let lat

                                    const queryString = `${street}&nbsp;${zipcode}&nbsp;${city}`
                                    //https://api.mapbox.com/geocoding/v5/mapbox.places/Panoramaweg&nbsp;19&nbsp;89155&nbsp;Erbach.json?access_token=pk.eyJ1IjoidGhlcm1pc3RvIiwiYSI6ImNsOWk3NGRsbTBuMXEzdW8wYXhkcTMzd2IifQ.BNNCqXcZlA5_wTGBjXtb5w
                                    //console.log(`https://api.mapbox.com/geocoding/v5/mapbox.places/${queryString}.json`)
                                    try {
                                        await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${queryString}.json`, {
                                            params: {
                                                access_token: process.env.REACT_APP_MAPBOX_API_KEY
                                            }
                                        })
                                            .then(function (response) {
                                                resp = response
                                                //coordinates = [response.data.features[0].geometry.coordinates[0], response.data.features[0].geometry.coordinates[1]]
                                                //lng = response.data.features[0].geometry.coordinates[0]
                                                //lat = response.data.features[0].geometry.coordinates[1]
                                                //console.log(`${name}, lng: ${lng} lat: ${lat}`)
                                                //console.log(coordinates)
                                                coordinates = resp.data.features[0].geometry.coordinates
                                            })


                                        const markers = new mapboxgl.Marker()
                                            .setLngLat(coordinates)
                                            .setPopup(
                                                new mapboxgl.Popup({offset: 25}) // add popups
                                                    .setHTML(
                                                        `<h3>${name}</h3><p>${street}<br/>${zipcode}, ${city}</p>`
                                                    )
                                            )
                                            .addTo(map.current)
                                    } catch (e) {
                                        console.error(e)
                                    }

                                }
                            }
                }
                 */

export default StandardMap;
