'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


export default function FeedbackPage() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        // label: 'My First dataset',
        // backgroundColor: 'rgba(75,192,192,0.4)',
        // borderColor: 'rgba(75,192,192,1)',
        // borderWidth: 1,
        // hoverBackgroundColor: 'rgba(75,192,192,0.8)',
        // hoverBorderColor: 'rgba(75,192,192,1)',
        data: [0.1,0.2,0.3,0.4,0.5,0.6,0.1],
        label: 'Feedback Score',
      },

      // {
      //   label: 'My Second dataset',
      //   backgroundColor: 'rgba(153,102,255,0.4)',
      //   borderColor: 'rgba(153,102,255,1)',
      //   borderWidth: 1,
      //   hoverBackgroundColor: 'rgba(153,102,255,0.8)',
      //   hoverBorderColor: 'rgba(153,102,255,1)',
      //   data: [28, 48, 40, 19, 86, 27, 90]

      // },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  return (
    <div>
      <Line data={data} height={30} width={40} options={options} />
    </div>
  );
}
