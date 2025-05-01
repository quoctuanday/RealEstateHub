/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useEffect, useRef, useState } from 'react';
import { autoComplete, getPlaceDetail } from '@/api/places/goong';
import polyline from '@mapbox/polyline';
import { Button, Input } from 'antd';

const GOONG_API_KEY = process.env.NEXT_PUBLIC_MAP_API;

interface Props {
    visible: boolean;
    onClose: () => void;
    destination: { lat: number; lng: number };
}

const DirectionMapModal = ({ visible, onClose, destination }: Props) => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [route, setRoute] = useState<any>(null);
    const [distance, setDistance] = useState<string>('');
    console.log(route);

    // Tạo map khi hiển thị modal
    useEffect(() => {
        if (!visible || typeof window === 'undefined') return;

        const goongjs = require('@goongmaps/goong-js');
        goongjs.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_API;

        const map = new goongjs.Map({
            container: 'direction-map',
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: [destination.lng, destination.lat],
            zoom: 13,
        });

        mapRef.current = map;

        // Thêm marker đích với popup địa chỉ
        fetch(
            `https://rsapi.goong.io/Geocode?latlng=${destination.lat},${destination.lng}&api_key=${GOONG_API_KEY}`
        )
            .then((res) => res.json())
            .then((data) => {
                const address =
                    data.results[0]?.formatted_address || 'Điểm đến';
                new goongjs.Marker({ color: 'red' })
                    .setLngLat([destination.lng, destination.lat])
                    .setPopup(
                        new goongjs.Popup({ offset: 25 }).setText(address)
                    )
                    .addTo(map);
            });

        return () => map.remove();
    }, [visible, destination]);

    // Gợi ý AutoComplete
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchInput.trim().length === 0) {
                setSuggestions([]);
                return;
            }
            const res = await autoComplete({ input: searchInput });
            setSuggestions(res.data.predictions || []);
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchInput]);

    // Cập nhật marker vị trí bắt đầu
    const updateOriginMarker = async (lat: number, lng: number) => {
        const goongjs = require('@goongmaps/goong-js');
        setOrigin({ lat, lng });

        const map = mapRef.current;
        map.flyTo({ center: [lng, lat], zoom: 14 });

        if (markerRef.current) markerRef.current.remove();

        // Lấy địa chỉ từ lat,lng
        let popupText = 'Vị trí bắt đầu';
        try {
            const res = await fetch(
                `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`
            );
            const data = await res.json();
            popupText = data.results[0]?.formatted_address || popupText;
        } catch (err) {
            console.error('Không thể lấy địa chỉ:', err);
        }

        const marker = new goongjs.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .setPopup(new goongjs.Popup({ offset: 25 }).setText(popupText))
            .addTo(map);

        marker.on('dragend', async () => {
            const pos = marker.getLngLat();
            setOrigin({ lat: pos.lat, lng: pos.lng });

            // Cập nhật popup theo tọa độ mới
            try {
                const res = await fetch(
                    `https://rsapi.goong.io/Geocode?latlng=${pos.lat},${pos.lng}&api_key=${GOONG_API_KEY}`
                );
                const data = await res.json();
                const newAddress =
                    data.results[0]?.formatted_address || 'Vị trí bắt đầu';
                marker.setPopup(
                    new goongjs.Popup({ offset: 25 }).setText(newAddress)
                );
            } catch {
                marker.setPopup(
                    new goongjs.Popup({ offset: 25 }).setText('Vị trí bắt đầu')
                );
            }
        });

        markerRef.current = marker;
    };

    // Gọi chỉ đường
    const handleDirection = async () => {
        if (!origin) return;

        const res = await fetch(
            `https://rsapi.goong.io/Direction?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&vehicle=car&api_key=${GOONG_API_KEY}`
        );
        const data = await res.json();
        const routeData = data.routes[0];

        setDistance(routeData.legs[0].distance.text);

        const geojson = {
            type: 'Feature',
            geometry: polyline.toGeoJSON(routeData.overview_polyline.points),
        };

        setRoute(geojson);

        const map = mapRef.current;
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        } else {
            map.addSource('route', {
                type: 'geojson',
                data: geojson,
            });
            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': '#1976d2',
                    'line-width': 6,
                },
            });
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <div className="p-4 flex gap-2 relative">
                <div className="relative">
                    <Input
                        className="border px-2 py-1 w-96"
                        placeholder="Nhập vị trí hiện tại..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 bg-white border w-full z-10 max-h-60 overflow-y-auto">
                            {suggestions.map((item) => (
                                <li
                                    key={item.place_id}
                                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={async () => {
                                        setSearchInput(item.description);
                                        setSuggestions([]);
                                        const detail = await getPlaceDetail({
                                            place_id: item.place_id,
                                        });
                                        const loc =
                                            detail.data.result.geometry
                                                .location;
                                        updateOriginMarker(loc.lat, loc.lng);
                                    }}
                                >
                                    {item.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Button
                    variant="outlined"
                    color="cyan"
                    className=" px-3 py-1"
                    onClick={handleDirection}
                >
                    Chỉ đường
                </Button>
                <Button
                    variant="outlined"
                    color="danger"
                    className="ml-auto"
                    onClick={onClose}
                >
                    Đóng
                </Button>
            </div>
            <div id="direction-map" className="flex-1" />
            {distance && (
                <div className="p-4 text-lg text-center">
                    Khoảng cách đến địa điểm: <strong>{distance}</strong>
                </div>
            )}
        </div>
    );
};

export default DirectionMapModal;
