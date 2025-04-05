'use client';
import { getAllUser, updateUsers } from '@/api/api';
import FilterUsers from '@/components/filterUser';
import { User } from '@/schema/User';
import { useUser } from '@/store/store';
import dateConvert from '@/utils/convertDate';
import { Button, Image, Input, Modal, Pagination, Rate, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiLock, CiUnlock } from 'react-icons/ci';

function ManageUsersPage() {
    const { socket } = useUser();
    const { Search } = Input;
    const [isFilter, setIsFilter] = useState(false);
    const [users, setUsers] = useState<User[] | null>(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [popupModal, setPopupModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSearch = async (value: string) => {
        console.log(value);
        const response = await getAllUser({ search: value });
        if (response) {
            const data = response.data.data;
            setUsers(data);
        }
    };

    const handlePageChange = (page: number, newSize?: number) => {
        setCurrentPage(page);
        if (newSize) {
            setPageSize(newSize);
        }
    };

    const handleRoleChange = async (role: string, userId: string) => {
        console.log(role, userId);
        const response = await updateUsers({ role: role, userId: userId });
        if (response) {
            toast.success('Đã cập nhật vài trò.');
            setPopupModal(false);
        }
    };

    useEffect(() => {
        const getData = async () => {
            const response = await getAllUser({
                page: currentPage,
                pageSize: pageSize,
            });
            if (response) {
                setUsers(response.data.data);
                setTotalPosts(response.data.totalPosts);
            }
        };
        getData();
        if (socket) {
            socket.on('user-update', () => {
                getData();
            });
            return () => {
                socket.off('user-update', () => {
                    getData();
                });
            };
        }
    }, [currentPage, pageSize, socket]);
    return (
        <div>
            <div className="p-[1rem]">
                <Search className="" onSearch={handleSearch} />
                <Button
                    className="mt-[1rem]"
                    type="primary"
                    onClick={() => setIsFilter(!isFilter)}
                >
                    Bộ lọc
                </Button>
                {isFilter && <FilterUsers className="" setUsers={setUsers} />}
            </div>
            <div className="w-full min-h-[30rem] bg-white">
                <div className="grid grid-cols-11">
                    <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Stt
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Tài khoản
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Ảnh đại diện
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Ngày tạo
                    </div>

                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Vai trò
                    </div>
                    <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                        Thao tác
                    </div>
                </div>
                {users === null ? (
                    <div className="flex items-center justify-center w-full h-[20rem]">
                        <Spin />
                    </div>
                ) : users.length > 0 ? (
                    <div className="">
                        {users.map((user, index) => (
                            <div className="grid grid-cols-11" key={user._id}>
                                <div className="col-span-1 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {index + 1 + (currentPage - 1) * pageSize}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    <span className="truncate">
                                        {user.userName}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    <Image
                                        src={
                                            user.image
                                                ? user.image
                                                : '/images/avatar-trang.jpg'
                                        }
                                        alt=""
                                        preview={false}
                                        width={60}
                                        height={60}
                                        className="rounded-full"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {user.createdAt
                                        ? dateConvert(user.createdAt)
                                        : ''}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    {user.role === 'admin' && 'Quản trị viên'}
                                    {user.role === 'moderator' &&
                                        'Kiểm duyệt viên'}
                                    {user.role === 'user' && 'Người dùng'}
                                </div>
                                <div className="col-span-2 flex justify-center items-center py-1 roboto-bold border-[1px]">
                                    <Button
                                        onClick={() => {
                                            setPopupModal(true);
                                            setSelectedUser(user);
                                        }}
                                        className="px-2 py-1 rounded-[10px] bg-rootColor hover:bg-[#699ba3b8] text-white"
                                    >
                                        Xem
                                    </Button>
                                    {user.isBlocked ? (
                                        <Button
                                            icon={<CiLock />}
                                            color="danger"
                                            variant="outlined"
                                            className="ml-3"
                                            htmlType="button"
                                            onClick={async () => {
                                                await updateUsers({
                                                    isBlocked: false,
                                                    userId: user._id,
                                                });
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            icon={<CiUnlock />}
                                            color="danger"
                                            variant="outlined"
                                            className="ml-3"
                                            htmlType="button"
                                            onClick={async () => {
                                                await updateUsers({
                                                    isBlocked: true,
                                                    userId: user._id,
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        Không có tài khoản nào !
                    </div>
                )}
                {popupModal && (
                    <Modal
                        title="Thông tin người dùng"
                        centered
                        open={popupModal}
                        onCancel={() => setPopupModal(false)}
                        loading={!selectedUser}
                        footer={null}
                    >
                        {selectedUser && (
                            <div>
                                <div className="grid grid-cols-6 gap-2">
                                    <div className="col-span-2 text-center">
                                        <Image
                                            src={
                                                selectedUser.image
                                                    ? selectedUser.image
                                                    : '/images/avatar-trang.jpg'
                                            }
                                            alt="Ảnh đại diện"
                                            width={150}
                                            height={150}
                                            className="rounded"
                                        />
                                        <h3 className="roboto-bold">
                                            Ảnh đại diện
                                        </h3>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="">
                                            <label className="roboto-bold">
                                                Tên người dùng:
                                            </label>
                                            <span className="ml-2">
                                                {selectedUser.userName}
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <label className="roboto-bold">
                                                Ngày sinh:
                                            </label>
                                            <span className="ml-2">
                                                {selectedUser.DOB
                                                    ? dateConvert(
                                                          selectedUser.DOB
                                                      )
                                                    : 'Chưa đặt ngày sinh.'}
                                            </span>
                                            <div className="ml-3">
                                                <label className="roboto-bold">
                                                    Giới tính:
                                                </label>
                                                <span className="ml-2">
                                                    {selectedUser.gender}
                                                </span>
                                            </div>
                                        </div>
                                        <div className=" mt-1">
                                            <label className="roboto-bold">
                                                Email:
                                            </label>
                                            <span className="ml-2">
                                                {selectedUser.email}
                                            </span>
                                        </div>
                                        <div className=" mt-1">
                                            <label className="roboto-bold">
                                                Số điện thoại:
                                            </label>
                                            <span className="ml-2">
                                                {selectedUser.phoneNumber}
                                            </span>
                                        </div>
                                        <div className=" mt-1">
                                            <label className="roboto-bold">
                                                Vai trò:
                                            </label>
                                            <span className="ml-2">
                                                {selectedUser.role === 'user' &&
                                                    'Người dùng'}
                                                {selectedUser.role ===
                                                    'moderator' &&
                                                    'Kiểm duyệt viên'}
                                                {selectedUser.role ===
                                                    'admin' && 'Quản trị viên'}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center">
                                            <label className="roboto-bold">
                                                Độ tin cậy:
                                            </label>
                                            <Rate
                                                className="ml-2"
                                                allowHalf
                                                value={selectedUser.rate}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center mt-5">
                                    <Button
                                        className=""
                                        htmlType="button"
                                        variant="solid"
                                        color="danger"
                                        onClick={() =>
                                            handleRoleChange(
                                                'user',
                                                selectedUser._id
                                            )
                                        }
                                        disabled={
                                            selectedUser.role !== 'moderator'
                                        }
                                    >
                                        Huỷ quyền kiểm duyệt
                                    </Button>
                                    <Button
                                        className="ml-3"
                                        htmlType="button"
                                        variant="solid"
                                        color="blue"
                                        onClick={() =>
                                            handleRoleChange(
                                                'moderator',
                                                selectedUser._id
                                            )
                                        }
                                        disabled={selectedUser.role !== 'user'}
                                    >
                                        Cấp quyền kiểm duyệt
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}

                <Pagination
                    className="mt-5 flex items-center justify-center"
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalPosts}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={['5', '10', '20', '50']}
                />
            </div>
        </div>
    );
}

export default ManageUsersPage;
