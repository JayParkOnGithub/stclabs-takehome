'use client';
import { Dropdown, Table } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import ChartData from '../ChartData/page';

interface ChartType {
  ip: string;
  fixedTimestamp: Date;
  request: string;
  path: string;
  httpType: string;
  response: string;
  label: number;
}
const Chart = () => {
  const [csvData, setCsvData] = useState<ChartType[]>([
    {
      ip: '',
      fixedTimestamp: new Date(),
      request: '',
      path: '',
      httpType: '',
      response: '',
      label: 0,
    },
  ]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [sortedData, setSortedData] = useState<ChartType[]>([]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const dataToDisplay = useMemo(() => {
    if (filter === 'ALL') {
      return sortedData;
    } else if (
      filter === 'GET' ||
      filter === 'POST' ||
      filter === 'PUT' ||
      filter === 'DELETE'
    ) {
      return sortedData.filter((item) => item.request === filter);
    }
    return [];
  }, [filter, csvData, sortedData]);

  useEffect(() => {
    setLoading(true);
    // can use API call or papaparse to retrieve csv file properly
    const csvLogData = `data,label
    10.128.2.1 [29/Nov/2017:06:58:55 GET /login.php HTTP/1.1 200,0
    10.128.2.1 [29/Nov/2017:06:59:02 POST /process.php HTTP/1.1 302,0
    10.128.2.1 [29/Nov/2017:06:59:03 GET /home.php HTTP/1.1 200,0
    10.131.2.1 [29/Nov/2017:06:59:04 GET /js/vendor/moment.min.js HTTP/1.1 200,0
    10.130.2.1 [29/Nov/2017:06:59:06 GET /bootstrap-3.3.7/js/bootstrap.js HTTP/1.1 200,0
    10.130.2.1 [29/Nov/2017:06:59:19 GET /profile.php?user=bala HTTP/1.1 200,0
    10.128.2.1 [29/Nov/2017:06:59:19 GET /js/jquery.min.js HTTP/1.1 200,0
    10.131.2.1 [29/Nov/2017:06:59:19 GET /js/chart.min.js HTTP/1.1 200,0
    10.131.2.1 [29/Nov/2017:06:59:30 GET /edit.php?name=bala HTTP/1.1 200,0
    10.131.2.1 [29/Nov/2017:06:59:37 GET /logout.php HTTP/1.1 302,0
    10.131.2.1 [29/Nov/2017:06:59:37 GET /login.php HTTP/1.1 200,0
    10.130.2.1 [29/Nov/2017:07:00:19 GET /login.php HTTP/1.1 200,0
    10.130.2.1 [29/Nov/2017:07:00:21 GET /login.php HTTP/1.1 200,0`;

    const lines = csvLogData.split('\n').slice(1);

    const parsedData = lines.map((line) => {
      const parts = line.split(' ');

      const ip = parts[4];
      const timestamp = parts[5].replace('[', '');
      const request = parts[6];
      const path = parts[7];
      const httpType = parts[8];
      const response = parts[9].split(',')[0];
      const label = 0; // not sure what this is for?

      const monthToNumber: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };

      const monthString = parts[5].split('/')[1];
      const month = parseInt(monthToNumber[monthString]) - 1;

      const [dayStr, _, yearTime] = timestamp.split('/');
      const day = parseInt(dayStr);
      const yearTimeParts = yearTime.split(':');
      const year = parseInt(yearTimeParts[0]);
      const time = yearTimeParts.slice(1).join(':');

      const [hour, minute, second] = time.split(':');

      const fixedTimestamp = new Date(
        year,
        month,
        day,
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );

      return {
        ip,
        fixedTimestamp,
        request,
        path,
        httpType,
        response,
        label,
      };
    });
    setCsvData(parsedData);
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      const sortedDataCopy = [...filteredData].sort((a, b) => {
        let valueA, valueB;

        if (sortKey === 'timestamp') {
          valueA = a.fixedTimestamp;
          valueB = b.fixedTimestamp;
        } else if (sortKey === 'ip') {
          valueA = a.ip.split('.').map(Number).join('.');
          valueB = b.ip.split('.').map(Number).join('.');
        } else {
          valueA = a[sortKey as keyof ChartType];
          valueB = b[sortKey as keyof ChartType];
        }

        if (sortOrder === 'asc') {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
        } else {
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
        }
        return 0;
      });

      setSortedData(sortedDataCopy);
    }
  }, [csvData, sortKey, sortOrder]); // Dependencies updated

  const filteredData = useMemo(() => {
    if (
      filter === 'GET' ||
      filter === 'POST' ||
      filter === 'PUT' ||
      filter === 'DELETE'
    ) {
      return csvData.filter((item) => item.request === filter);
    }
    return csvData;
  }, [csvData, filter]);

  useEffect(() => {
    setLoading(false);
  }, [sortedData]);

  return (
    <div className='flex'>
      <div>
        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <div>
            <div>
              <Dropdown label='Filter by request'>
                <Dropdown.Item onClick={() => setFilter('ALL')}>
                  ALL
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('GET')}>
                  GET
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('POST')}>
                  POST
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('PUT')}>
                  PUT
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('DELETE')}>
                  DELETE
                </Dropdown.Item>
              </Dropdown>
            </div>
            <Table striped>
              <Table.Head>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('ip')}
                >
                  IP Address
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('fixedTimestamp')}
                >
                  Timestamp
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('request')}
                >
                  Request
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('path')}
                >
                  Path
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('httpType')}
                >
                  HTTP Type
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('response')}
                >
                  Response Code
                </Table.HeadCell>
                <Table.HeadCell
                  className='cursor-pointer'
                  onClick={() => handleSort('label')}
                >
                  Label
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {dataToDisplay.map((row: ChartType, index) => (
                  <ChartData
                    key={index}
                    ip={row.ip}
                    timestamp={row.fixedTimestamp}
                    request={row.request}
                    path={row.path}
                    httpType={row.httpType}
                    response={row.response}
                    label={row.label}
                  />
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
