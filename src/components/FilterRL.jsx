import { Cascader, DatePicker, Space } from 'antd';
import { useState } from 'react';
import { Filter } from 'react-iconly';
import Button from '../components/Button';

const { RangePicker } = DatePicker;

const FilterDropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonBgColor, setButtonBgColor] = useState('#FFFFFF'); // State untuk warna latar belakang tombol
  const [iconColor, setIconColor] = useState('#DC362E'); // State untuk warna ikon

  const options = [
    {
      value: 'Master Data',
      label: 'Master Data',
      children: [
        {
          value: 'Variable Input Form',
          label: 'Variable Input Form',
          children: [
            { value: 'Translation', label: 'Translation' },
            { value: 'Vendor', label: 'Vendor' },
            { value: 'Non Translation', label: 'Non Translation' },
          ],
        },
        { value: 'Rate', label: 'Rate' },
        { value: 'Tool', label: 'Tool' },
        { value: 'Financial Directory', label: 'Financial Directory' },
      ],
    },
    {
      value: 'Resource Manager',
      label: 'Resource Manager',
      children: [
        { value: 'Translation', label: 'Translation' },
        { value: 'Non Translation', label: 'Non Translation' },
        { value: 'Vendor', label: 'Vendor' },
      ],
    },
  ];

  //mengubah warna bg dan icon
  const onClickButton = () => {
    setIsOpen(!isOpen);
    setButtonBgColor(isOpen ? '#FFFFFF' : '#DC362E');
    setIconColor(isOpen ? '#DC362E' : '#FFFFFF');
  };

  const onChange = (value) => {
    console.log('Selected:', value);
    setIsOpen(true);
  };

  const displayRender = (labels) => labels.join(' / ');

  return (
    <div className="relative inline-block text-left">
      <Button
        className="inline-flex justify-between items-center w-[48px] h-[48px] bg-white border border-[#E9E9E9] hover:bg-gray-50 text-sm"
        style={{ backgroundColor: buttonBgColor }}
        onClick={onClickButton}
      >
        <Filter
          className="text-[#DC362E]"
          size="large"
          set="two-tone"
          style={{ color: iconColor }}
        />
      </Button>
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-[300px] h-[165px] rounded-[10px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="text-[#BBBBBB] px-4 py-2 text-[12px] font-semibold mx-1 mt-2 mb-2">
            FILTER
          </div>
          <Cascader
            options={options}
            onChange={onChange}
            placeholder="Filter by Menu"
            displayRender={displayRender}
            style={{
              width: '89%',
              height: '40px',
              marginInline: '16px',
            }}
          />
          <Space
            direction="vertical"
            size={12}
            style={{ marginTop: '15px', marginInline: '16px' }}
          >
            <RangePicker style={{ height: '40px', width: '100%' }} />
          </Space>
        </div>
      )}
    </div>
  );
};

export default FilterDropdownButton;
