import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { TwoUsers } from 'react-iconly';
import api from '../api';

const backgroundColors = {
  totalVendors: 'bg-[#FBEBEA]',
  totalTranslations: 'bg-[#E6EFFA]',
  totalNonTranslations: 'bg-[#E8F9F0]',
};

const iconColors = {
  totalVendors: '#DC362E',
  totalTranslations: '#065BCC',
  totalNonTranslations: '#15BF64',
};

const MiniCards = () => {
  const [data, setData] = useState({
    totalVendors: 0,
    totalTranslations: 0,
    totalNonTranslations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/count-month`
        );

        const result = response.data.data;
        setData({
          totalVendors: result.total_vendors,
          totalTranslations: result.total_translation,
          totalNonTranslations: result.total_nontranslation,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-around flex-wrap">
      {Object.entries(data).map(([key, value]) => (
        <Card
          key={key}
          className="flex flex-col items-center justify-center h-[160px] w-[340px]"
        >
          <div className="flex items-center justify-end w-full px-4">
            <div
              className={`flex items-center justify-center w-[90px] h-[90px] rounded-full ${backgroundColors[key]} mr-6`}
            >
              <span style={{ color: iconColors[key] }}>
                <TwoUsers size={40} set="bulk" />
              </span>
            </div>
            <div>
              <p className="text-[24px] mb-1 text-[#232323] font-bold">
                {value}
              </p>
              <p className="text-[14px] text-[#9A9A9A]">
                {key
                  .replace('total', 'Total ')
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </p>
              <p className="text-[14px] text-[#9A9A9A]">This Month</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MiniCards;
