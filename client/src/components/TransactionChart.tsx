'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface TransactionChartProps {
    transactions: { date: string; amount: number }[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({
    transactions,
}) => {
    if (transactions.length === 0) {
        return (
            <div className="flex justify-center items-center w-full h-40">
                Chưa có giao dịch
            </div>
        );
    }

    let balance = 0;
    const dataForChart = transactions.map((t) => {
        balance += t.amount;
        return {
            date: t.date,
            balance: balance,
        };
    });

    const chartData = {
        labels: dataForChart.map((d) => d.date),
        datasets: [
            {
                label: 'Số dư tích lũy (VND)',
                data: dataForChart.map((d) => d.balance),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            tooltip: { mode: 'index' as const, intersect: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default TransactionChart;
