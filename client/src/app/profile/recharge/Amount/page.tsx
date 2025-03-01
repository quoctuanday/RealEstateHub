'use client';
import { checkOut } from '@/api/api';
import { Button, Form, FormProps, InputNumber, Radio } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type FieldType = {
    amount: number;
};

const amountOptions = [50000, 100000, 200000, 500000, 1000000, 2000000];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomRadio = ({ value, selected, onChange }: any) => {
    return (
        <label
            className={`
            h-20 flex flex-col items-center justify-center border rounded-md cursor-pointer p-2
            ${
                selected
                    ? 'border-blue-500 bg-blue-100 shadow-custom-medium'
                    : 'border-gray-300'
            }
          `}
            onClick={onChange}
        >
            <span className="text-lg font-bold">
                {value.toLocaleString('vi-VN')} VND
            </span>
        </label>
    );
};

function AmountPage() {
    const router = useRouter();
    const [amount, setAmount] = useState<number | null>(null);
    const [form] = Form.useForm();

    const validateMessages = {
        required: 'Bạn chưa nhập trường này!',
        types: {
            number: 'Số tiền Không hợp lệ!',
        },
    };

    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const sendData = async () => {
            const response = await checkOut(values);
            if (response) {
                const data = response.data;
                const shortLink = data.vnpUrl;
                setTimeout(() => {
                    router.push(shortLink);
                }, 500);
            }
        };
        sendData();
    };

    return (
        <div className="bg-hoverColor pb-[1.25rem] w-full h-full flex justify-center">
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                validateMessages={validateMessages}
                className=" mt-[1.25rem] p-[1.25rem] w-[50rem] h-[30rem] rounded bg-white"
            >
                <Form.Item<FieldType>
                    label={
                        <span className="roboto-bold">
                            Nhập số tiền cần nạp (VND) :
                        </span>
                    }
                    name="amount"
                    className=""
                    rules={[{ required: true }, { type: 'number' }]}
                >
                    <InputNumber
                        placeholder="Nhập số tiền"
                        className="w-full"
                        formatter={(value) =>
                            value
                                ? value
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                : ''
                        }
                        parser={(value) =>
                            value ? value.replace(/\./g, '') : ''
                        }
                    />
                </Form.Item>
                <span>Hoặc chọn nhanh dưới đây:</span>
                <Form.Item>
                    <Radio.Group
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        className="grid grid-cols-3 gap-3"
                    >
                        {amountOptions.map((value) => (
                            <CustomRadio
                                key={value}
                                value={value}
                                selected={amount === value}
                                onChange={() => {
                                    form.setFieldsValue({ amount: value });
                                    setAmount(value);
                                }}
                                onClick={() => console.log('Click')}
                                className="col-span-1"
                            />
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                        Tiếp tục
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AmountPage;
