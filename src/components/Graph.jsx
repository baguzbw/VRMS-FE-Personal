import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';
import api from '../api';
import DropdownButton from './DropdownButton';

const Grafik = () => {
  const [allData, setAllData] = useState({});
  const [data, setData] = useState({
    vendor: [],
    translation: [],
    nonTranslation: [],
  });
  const [selectedYear, setSelectedYear] = useState(null);
  const [options, setOptions] = useState([{ label: 'YEAR' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/graph`
        );
        const years = Object.keys(response.data.data.years)
          .map((year) => ({ label: year }))
          .reverse();
        setOptions([{ label: 'YEAR' }, ...years]);
        setAllData(response.data.data.years);
        setSelectedYear(years[0].label);
        setData(response.data.data.years[years[0].label]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setData(allData[year]);
  };

  return (
    <div className="flex justify-around flex-wrap my-8">
      <div className="chart-container flex-grow">
        <div className="flex justify-start ml-[40px] mr-[24px] mt-[30px] font-figtree">
          <p className="font-[16px] mt-[12px] mr-[24px]">Resource</p>
          {options.length > 1 && ( // Ensure there are years to select
            <DropdownButton options={options} onChange={handleYearChange} />
          )}
        </div>
        {!loading && (
          <LineChart
            series={[
              {
                data: data.vendor,
                color: '#DC362E',
                label: 'Vendor',
              },
              {
                data: data.translation,
                color: '#065BCC',
                label: 'Translation',
              },
              {
                data: data.nonTranslation,
                color: '#15BF64',
                label: 'Non Translation',
              },
            ]}
            className="chart-container"
            height={400} //atur selisih Y axis
            xAxis={[
              {
                scaleType: 'point',
                data: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Grafik;
