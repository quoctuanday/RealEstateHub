'use client';
import { Notify } from '@/schema/notification';
import { Empty, Modal, Tag, Typography, Divider, Card } from 'antd';
import { useEffect, useState } from 'react';
import { updateNotify } from '@/api/api';

const { Title, Text, Paragraph } = Typography;

interface ModalNotificationProps {
    open: boolean;
    onClose: () => void;
    notifications: Notify[];
}

export default function ModalNotification({
    open,
    onClose,
    notifications: initialNotifications = [],
}: ModalNotificationProps) {
    const [selected, setSelected] = useState<Notify | null>(null);
    const [notifications, setNotifications] = useState(initialNotifications);

    const handleSelect = async (notify: Notify) => {
        setSelected(notify);

        if (!notify.isRead) {
            try {
                await updateNotify(notify._id, { isRead: true });

                setNotifications((prev) =>
                    prev.map((n) =>
                        n._id === notify._id ? { ...n, isRead: true } : n
                    )
                );
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái đã đọc:', error);
            }
        }
    };

    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    return (
        <Modal
            title="Thông báo"
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            {notifications.length === 0 ? (
                <div className="py-8 flex justify-center items-center">
                    <Empty description="Chưa có thông báo nào" />
                </div>
            ) : (
                <div className="flex gap-6 max-h-[500px] overflow-hidden">
                    <ul className="w-1/2 overflow-y-auto pr-2 space-y-3">
                        {[...notifications]
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt || '').getTime() -
                                    new Date(a.createdAt || '').getTime()
                            )
                            .map((n) => (
                                <li
                                    key={n._id}
                                    onClick={() => handleSelect(n)}
                                    className={`cursor-pointer border rounded p-3 transition ${
                                        n.isRead
                                            ? 'bg-white'
                                            : 'bg-gray-50 border-blue-500'
                                    } hover:bg-gray-100`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-sm line-clamp-1">
                                            {n.title || 'Không có tiêu đề'}
                                        </p>
                                        {!n.isRead && (
                                            <Tag
                                                color="blue"
                                                className="ml-2 text-xs"
                                            >
                                                Chưa đọc
                                            </Tag>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {n.createdAt
                                            ? new Date(
                                                  n.createdAt
                                              ).toLocaleString()
                                            : '---'}
                                    </p>
                                </li>
                            ))}
                    </ul>

                    <div className="w-1/2">
                        {selected ? (
                            <Card
                                title="Chi tiết thông báo"
                                variant="borderless"
                            >
                                <div className="flex justify-between items-center">
                                    <Title level={5} className="m-0">
                                        {selected.title || 'Không có tiêu đề'}
                                    </Title>
                                    <Tag
                                        color={
                                            selected.isRead ? 'green' : 'blue'
                                        }
                                    >
                                        {selected.isRead
                                            ? 'Đã đọc'
                                            : 'Chưa đọc'}
                                    </Tag>
                                </div>

                                <Divider />

                                <Paragraph className="whitespace-pre-line">
                                    {selected.message}
                                </Paragraph>

                                <Text type="secondary">
                                    Ngày tạo:{' '}
                                    {selected.createdAt
                                        ? new Date(
                                              selected.createdAt
                                          ).toLocaleString()
                                        : ''}
                                </Text>
                            </Card>
                        ) : (
                            <Card variant="borderless">
                                <Text type="secondary">
                                    Chọn một thông báo để xem chi tiết.
                                </Text>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
