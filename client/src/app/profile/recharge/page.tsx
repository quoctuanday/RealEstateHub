import { Suspense } from 'react';
import RechargeContent from './RechargeContent';

export default function RechargePage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <RechargeContent />
        </Suspense>
    );
}
