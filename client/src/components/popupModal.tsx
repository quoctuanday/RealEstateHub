'use client';
import ViewPost from '@/components/viewPost';
import { Post } from '@/schema/Post';
import { Button } from 'antd';
import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
    setForm: React.Dispatch<React.SetStateAction<boolean>>;
    post: Post | null;
}

function PopupModal({ setForm, post }: Props) {
    return (
        <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 z-30 roboto-regular text-[1rem]">
            <div
                className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-black"
                onClick={() => setForm(false)}
            ></div>
            <div
                className="relative appear w-[52rem] max-h-[40rem] overflow-y-auto overflow-hidden min-h-[16rem] bg-white rounded-[10px] shadow-custom-light 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-[10px]
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-[10px]
          [&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
                <div className="flex justify-end pt-[1rem] px-[1rem]">
                    <Button
                        htmlType="button"
                        color="danger"
                        variant="outlined"
                        icon={<IoCloseOutline />}
                        onClick={() => setForm(false)}
                    />
                </div>
                <ViewPost post={post} />
            </div>
        </div>
    );
}

export default PopupModal;
