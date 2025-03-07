'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { autoComplete, getPlaceDetail } from '@/api/places/goong';
import { Button, Input } from 'antd';
import { PlaceDetail, Suggestion } from '@/schema/goong';
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
}

const MyAddressInput: React.FC<MyAddressInputProps> = ({ setLocation }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<PlaceDetail | null>(
        null
    );
    const [sessionToken] = useState(uuidv4());
    const [formAdrres, setFormAddress] = useState(false);

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedDetail(null);
        // Gọi API khi từ khóa có ít nhất 3 ký tự
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            // Ví dụ sử dụng location cố định; bạn có thể lấy tọa độ người dùng nếu cần
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
            const params = {
                place_id: suggestion.place_id,
                sessiontoken: sessionToken,
            };
            const { data } = await getPlaceDetail(params);
            setSelectedDetail(data.result);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết địa điểm:', error);
        }
    };
    // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setLocation((prevState) => {
    //         if (prevState === null) {
    //             return {
    //                 name: e.target.value,
    //                 coordinates: { latitude: 0, longitude: 0 },
    //             };
    //         }
    //         return { ...prevState, name: e.target.value };
    //     });
    // };

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
            {formAdrres && <AddressChoose setFormAddress={setFormAddress} />}
            {selectedDetail && (
                <div
                    style={{
                        marginTop: '20px',
                        border: '1px solid #ccc',
                        padding: '10px',
                    }}
                >
                    <h2>{selectedDetail.name}</h2>
                    <p>
                        <strong>Địa chỉ:</strong>{' '}
                        {selectedDetail.formatted_address}
                    </p>
                    <p>
                        <strong>Vĩ độ:</strong>{' '}
                        {selectedDetail.geometry?.location?.lat}
                    </p>
                    <p>
                        <strong>Kinh độ:</strong>{' '}
                        {selectedDetail.geometry?.location?.lng}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyAddressInput;
