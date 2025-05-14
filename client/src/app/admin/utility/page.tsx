import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function UtilityPage() {
    return (
        <>
            <h1 className="p-[1rem] roboto-bold">Danh mục</h1>
            <div className=" bg-white  p-[1rem] grid grid-cols-4 gap-3">
                <Link
                    href={'/admin/utility/legalDocuments'}
                    className="col-span-1 flex flex-col items-center hover:underline"
                >
                    <Image
                        src={'/images/icon/legal-document.png'}
                        alt=""
                        width={100}
                        height={100}
                        className="w-[2rem] h-[2rem] "
                    />
                    <h2>Văn bản pháp luật</h2>
                </Link>
            </div>
        </>
    );
}

export default UtilityPage;
