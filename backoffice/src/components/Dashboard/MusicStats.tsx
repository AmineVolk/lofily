import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: 'Music A',
    listened: 3000,
  },
  {
    name: 'Music B',
    listened: 1000,
  },
  {
    name: 'Music C',
    listened: 2000,
  },
  {
    name: 'Music D',
    listened: 200,
  },
  {
    name: 'Music E',
    listened: 1890,
  },
  {
    name: 'Music F',
    listened: 1390,
  },
  {
    name: 'Music G',
    listened: 2490,
  },
];
const MusicStats = () => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart width={300} height={100} data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='listened' fill='#82ca9d' />
      </BarChart>
    </ResponsiveContainer>
  );
};
export { MusicStats };
