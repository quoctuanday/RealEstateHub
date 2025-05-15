'use client';
import { Notify } from '@/schema/notification';
import { Empty, Modal } from 'antd';

interface ModalNotificationProps {
    open: boolean;
    onClose: () => void;
    notifications: Notify[];
}

export default function ModalNotification({
    open,
    onClose,
    notifications,
}: ModalNotificationProps) {
    return (
        <Modal
            title="Thông báo"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {notifications.length === 0 ? (
                <div className="py-8 flex justify-center items-center">
                    <Empty description="Chưa có thông báo nào" />
                </div>
            ) : (
                <ul className="mt-3 space-y-3">
                    {notifications.map((n) => (
                        <li
                            key={n._id}
                            className="border rounded p-3 hover:bg-gray-50 transition"
                        >
                            <p className="text-sm">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {n.createdAt
                                    ? new Date(n.createdAt).toLocaleString()
                                    : '---'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
}
