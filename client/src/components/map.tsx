/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useRef } from 'react';

type MapComponentProps = {
    latitude: number;
    longitude: number;
};

const MapView = ({ latitude, longitude }: MapComponentProps) => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && latitude && longitude) {
            const goongjs = require('@goongmaps/goong-js');
            goongjs.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_API;

            // Nếu map chưa được khởi tạo
            if (!mapRef.current) {
                const map = new goongjs.Map({
                    container: 'map',
                    style: 'https://tiles.goong.io/assets/goong_map_web.json',
                    center: [longitude, latitude],
                    zoom: 14,
                });

                mapRef.current = map;

                // Tạo marker ban đầu
                const marker = new goongjs.Marker()
                    .setLngLat([longitude, latitude])
                    .addTo(map);
                markerRef.current = marker;
            } else {
                // Nếu đã có map, chỉ cập nhật vị trí marker và map center
                mapRef.current.setCenter([longitude, latitude]);

                if (markerRef.current) {
                    markerRef.current.setLngLat([longitude, latitude]);
                } else {
                    const marker = new goongjs.Marker()
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current);
                    markerRef.current = marker;
                }
            }
        }
    }, [latitude, longitude]);

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css"
            />
            <div id="map" className="w-full h-[20rem] rounded-md" />
        </>
    );
};

export default MapView;
