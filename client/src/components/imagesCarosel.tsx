import { Image } from 'antd';
import React, { useState } from 'react';

interface Props {
    images: string[];
}

function ImagesCarosel({ images }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const selectImage = (index: number) => {
        setCurrentIndex(index);
    };
    return (
        <div>
            {images.length > 0 ? (
                <div>
                    <div className="relative mb-4 h-[40rem] w-full  overflow-hidden bg-black flex items-center justify-center">
                        <Image
                            src={images[currentIndex]}
                            alt={`Ảnh lớn`}
                            className="max-w-full max-h-full object-contain"
                            width={800}
                            height={500}
                        />
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        >
                            &#8249;
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        >
                            &#8250;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={image}
                                    alt={`Ảnh nhỏ ${index + 1}`}
                                    width={100}
                                    preview={false}
                                    height={100}
                                    className={`h-[5rem] w-full rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                                        currentIndex === index
                                            ? 'border-2 border-blue-500'
                                            : ''
                                    }`}
                                    onClick={() => selectImage(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Image
                    src="/path/to/default-image.jpg"
                    alt="Ảnh mặc định"
                    width={500}
                    preview={false}
                    height={500}
                    className="w-full h-auto rounded-lg"
                />
            )}
        </div>
    );
}

export default ImagesCarosel;
