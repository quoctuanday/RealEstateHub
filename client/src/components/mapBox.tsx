/* eslint-disable @typescript-eslint/no-var-requires */
import { useState, useEffect, useRef } from 'react';
import { getMapBox } from '@/api/places/goong';

interface Location {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

type MapComponentProps = {
    address: string;
    setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

const GoongMap = ({ address, setLocation }: MapComponentProps) => {
    const mapRef = useRef(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        return null;
    };

    useEffect(() => {
        if (address) {
            fetchCoordinates(address).then((coords) => {
                if (coords) {
                    setCenter(coords);
                    setLocation((prev) => ({
                        name: prev?.name || '',
                        coordinates: {
                            latitude: coords?.lat ?? 21.028,
                            longitude: coords?.lng ?? 105.83991,
                        },
                    }));
                }
            });
        }
    }, [address, setLocation]);

    useEffect(() => {
        if (typeof window !== 'undefined' && center && !mapLoaded) {
            const goongjs = require('@goongmaps/goong-js');
            goongjs.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_API;

            mapRef.current = new goongjs.Map({
                container: 'map',
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: [center.lng, center.lat],
                zoom: 14,
            });

            markerRef.current = new goongjs.Marker({ draggable: true })
                .setLngLat([center.lng, center.lat])
                .addTo(mapRef.current);

            markerRef.current.on('dragend', () => {
                const newCoords = markerRef.current.getLngLat();
                console.log('Tọa độ mới sau khi kéo:', newCoords);
                setCenter({ lat: newCoords.lat, lng: newCoords.lng });
                setLocation((prev) => ({
                    name: prev?.name || '',
                    coordinates: {
                        latitude: newCoords?.lat ?? 21.028,
                        longitude: newCoords?.lng ?? 105.83991,
                    },
                }));
            });
            setMapLoaded(true);
        }
    }, [center, mapLoaded, setLocation]);

    useEffect(() => {
        if (markerRef.current && mapRef.current && center) {
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
