'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Input, List, Space, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { chatBot } from '@/api/api';

const { TextArea } = Input;

const SUGGESTIONS = [
    'Xin chào',
    'Làm thế nào để liên hệ với chủ nhà?',
    'Tôi có thể gửi phản hồi bằng cách nào?',
];

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export default function DraggableChatbot() {
    const [visible, setVisible] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const chatButtonRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('chat-history');
        if (saved) setMessages(JSON.parse(saved));
    }, []);

    // Save to localStorage when messages update
    useEffect(() => {
        localStorage.setItem('chat-history', JSON.stringify(messages));
    }, [messages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.scrollTop = listElement.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        setMessages((prev) => [...prev, { sender: 'user' as const, text }]);

        const res = await chatBot({ messages: text });
        if (res) {
            const data = await res.data;
            console.log(data);
            const botText =
                data.reply ||
                'Hiện tại tôi chưa có câu trả lời cho câu hỏi này, nhưng tôi sẽ ghi nhận để cải thiện trong tương lai.';
            setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
            setInput('');
        }
    };

    // Dragging
    useEffect(() => {
        const el = chatButtonRef.current;
        if (!el) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        };

        const onMouseUp = () => (isDragging = false);

        el.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <>
            <div
                ref={chatButtonRef}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: 60,
                    height: 60,
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    cursor: 'move',
                }}
                onClick={() => setVisible(true)}
            >
                <MessageOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>

            <Modal
                open={visible}
                onCancel={() => setVisible(false)}
                title="Trợ lý ảo"
                footer={null}
            >
                <Space wrap style={{ marginBottom: 12 }}>
                    {SUGGESTIONS.map((s, i) => (
                        <Tag
                            key={i}
                            color="blue"
                            onClick={() => sendMessage(s)}
                            style={{ cursor: 'pointer' }}
                        >
                            {s}
                        </Tag>
                    ))}
                </Space>

                <div
                    ref={listRef}
                    style={{
                        maxHeight: 300,
                        overflowY: 'auto',
                        marginBottom: 12,
                        paddingRight: 4,
                    }}
                >
                    <List
                        dataSource={messages}
                        renderItem={(msg, idx) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <List.Item
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isUser
                                            ? 'flex-end'
                                            : 'flex-start',
                                        borderBottom: 'none',
                                    }}
                                >
                                    {!isUser && (
                                        <div style={{ marginRight: 8 }}>
                                            <MessageOutlined
                                                style={{ color: '#1890ff' }}
                                            />
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            backgroundColor: isUser
                                                ? '#1890ff'
                                                : '#f0f0f0',
                                            color: isUser ? '#fff' : '#000',
                                            padding: '8px 12px',
                                            borderRadius: 16,
                                            maxWidth: '70%',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </div>

                <TextArea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={(e) => {
                        e.preventDefault();
                        if (input.trim()) sendMessage(input);
                    }}
                    placeholder="Nhập câu hỏi..."
                />
                <Button
                    type="primary"
                    block
                    style={{ marginTop: 8 }}
                    onClick={() => sendMessage(input)}
                >
                    Gửi
                </Button>
            </Modal>
        </>
    );
}
