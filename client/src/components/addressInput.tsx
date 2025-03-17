'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { autoComplete } from '@/api/places/goong';
import { Button, Input } from 'antd';
import { Suggestion } from '@/schema/goong';
import AddressChoose from '@/components/addressChoose';

interface Location {
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface MyAddressInputProps {
    setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
    location: Location | null;
}

const MyAddressInput: React.FC<MyAddressInputProps> = ({
    setLocation,
    location,
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [sessionToken] = useState(uuidv4());
    const [formAdrres, setFormAddress] = useState(false);

    useEffect(() => {
        if (location?.name) {
            setQuery(location.name);
        }
    }, [location?.name]);

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const location = '21.013715429594125,105.79829597455202';
            const params = {
                input: value,
                location,
                limit: 5,
                radius: 50,
                sessiontoken: sessionToken,
                more_compound: true,
            };

            const { data } = await autoComplete(params);
            setSuggestions(data.predictions || []);
        } catch (error) {
            console.error('Lỗi khi lấy gợi ý:', error);
        }
    };

    const handleSuggestionClick = async (suggestion: Suggestion) => {
        try {
            const nameAdress = suggestion?.structured_formatting
                ? `${suggestion.structured_formatting.main_text} - ${suggestion.structured_formatting.secondary_text}`
                : '';

            setLocation((prev) => ({
                ...prev,
                name: nameAdress,
                coordinates: prev?.coordinates ?? { latitude: 0, longitude: 0 },
            }));
            console.log(nameAdress);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết địa điểm:', error);
        }
    };

    return (
        <div>
            <Input
                type="text"
                placeholder="Nhập địa chỉ hoặc từ khóa..."
                value={query}
                onChange={handleInputChange}
                className="w-full"
            />
            {suggestions.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {suggestions.map((item) => (
                        <li
                            key={item.place_id}
                            className="border-b py-2 cursor-pointer hover:bg-blue-400 hover:text-white pl-2 rounded"
                            onClick={() => handleSuggestionClick(item)}
                        >
                            <strong>
                                {item.structured_formatting?.main_text}
                            </strong>{' '}
                            - {item.structured_formatting?.secondary_text}
                        </li>
                    ))}
                </ul>
            )}
            <span className="block roboto-bold text-[1rem] mt-2">Hoặc</span>
            <Button
                htmlType="button"
                onClick={() => setFormAddress(true)}
                className="mt-1"
            >
                Chọn địa chỉ
            </Button>
            {formAdrres && (
                <AddressChoose
                    setFormAddress={setFormAddress}
                    setAddressLocation={setLocation}
                />
            )}
        </div>
    );
};

export default MyAddressInput;
