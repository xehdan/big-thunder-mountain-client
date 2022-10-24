import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import axios from "axios";

function StandardMap(props) {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY

    const mapContainer = useRef(null);
    const map = useRef(null);
    // 48.50576,10.0186865
    const [lng, setLng] = useState(10.0186865);
    const [lat, setLat] = useState(48.50576);
    const [zoom, setZoom] = useState(7);
    const [language, setLangauge] = useState(new MapboxLanguage())

    useEffect( () => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.addControl(language);

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
        const hqMarker = new mapboxgl.Marker({color: '#f7a700'})
            .setLngLat([lng, lat])
            .addTo(map.current)


        fetchData()


    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        })
    })

    return (
        <div ref={mapContainer}  style={{ minHeight: props.height, height: '100%'}} />
    );
}

export default StandardMap;