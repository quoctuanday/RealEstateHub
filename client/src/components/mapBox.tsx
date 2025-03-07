import { useState, useEffect, useRef } from 'react';
import { getMapBox } from '@/api/places/goong';

type MapComponentProps = {
    address: string;
};

const GoongMap = ({ address }: MapComponentProps) => {
    const mapRef = useRef(null);
    const markerRef = useRef<any>(null);
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [mapLoaded, setMapLoaded] = useState(false);

    const fetchCoordinates = async (address: string) => {
        try {
            const response = await getMapBox({ address });
            if (response.data.results && response.data.results.length > 0) {
                const loc = response.data.results[0].geometry.location;
                console.log('Tọa độ trả về:', loc);
                return { lat: loc.lat, lng: loc.lng };
            }
        } catch (error) {
            console.error('Lỗi khi lấy tọa độ:', error);
        }
        return null; // Không trả về tọa độ mặc định
    };

    useEffect(() => {
        if (address) {
            fetchCoordinates(address).then((coords) => {
                if (coords) {
                    setCenter(coords);
                }
            });
        }
    }, [address]);

    useEffect(() => {
        if (typeof window !== 'undefined' && center && !mapLoaded) {
            const goongjs = require('@goongmaps/goong-js');
            goongjs.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_API;

            mapRef.current = new goongjs.Map({
                container: 'map',
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: [center.lng, center.lat], // Chỉ render khi có tọa độ
                zoom: 14,
            });

            markerRef.current = new goongjs.Marker({ draggable: true })
                .setLngLat([center.lng, center.lat])
                .addTo(mapRef.current);

            markerRef.current.on('dragend', () => {
                const newCoords = markerRef.current.getLngLat();
                console.log('Tọa độ mới sau khi kéo:', newCoords);
                setCenter({ lat: newCoords.lat, lng: newCoords.lng });
            });
            setMapLoaded(true);
        }
    }, [center, mapLoaded]);

    useEffect(() => {
        if (markerRef.current && center) {
            markerRef.current.setLngLat([center.lng, center.lat]);
        }
    }, [center]);

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css"
            />
            {center ? (
                <div id="map" className="w-full h-[20rem]"></div>
            ) : (
                <p>Đang tải bản đồ...</p>
            )}
        </>
    );
};

export default GoongMap;
