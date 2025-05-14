import { Modal } from 'antd';

type FilePreviewModalProps = {
    visible: boolean;
    onClose: () => void;
    fileUrl: string | null;
};

const FilePreviewModal = ({
    visible,
    onClose,
    fileUrl,
}: FilePreviewModalProps) => {
    const viewerUrl = fileUrl
        ? `https://docs.google.com/gview?url=${encodeURIComponent(
              fileUrl
          )}&embedded=true`
        : '';
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width="80%"
            styles={{
                body: {
                    height: '80vh',
                    padding: 0,
                    overflow: 'hidden',
                },
            }}
        >
            {fileUrl ? (
                <iframe
                    src={viewerUrl}
                    title="Tài liệu"
                    className="w-full h-full"
                />
            ) : (
                <div className="p-4">Không có file để hiển thị</div>
            )}
        </Modal>
    );
};

export default FilePreviewModal;
