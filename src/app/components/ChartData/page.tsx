import { Table } from 'flowbite-react';

interface ChartProps {
  ip: string;
  timestamp: Date;
  request: string;
  path: string;
  httpType: string;
  response: string;
  label: number;
}

const ChartData: React.FC<ChartProps> = (props: ChartProps) => {
  const { ip, timestamp, request, path, httpType, response, label } = props;

  const formattedTimestamp = timestamp.toLocaleString();
  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
      <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
        {ip}
      </Table.Cell>
      <Table.Cell>{formattedTimestamp}</Table.Cell>
      <Table.Cell>{request}</Table.Cell>
      <Table.Cell>{path}</Table.Cell>
      <Table.Cell>{httpType}</Table.Cell>
      <Table.Cell>{response}</Table.Cell>
      <Table.Cell>{label}</Table.Cell>
    </Table.Row>
  );
};

export default ChartData;
