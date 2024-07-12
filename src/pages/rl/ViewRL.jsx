import { X } from '@phosphor-icons/react';
import { Button as AntButton, Cascader, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { Filter } from 'react-iconly';
import BaseTable from '../../components/BaseTable';
import Button from '../../components/Button';
import DropdownButton from '../../components/DropdownButton';
import Footer from '../../components/Footer';
import Navbar from '../../components/NavBar';
import Search from '../../components/Search';

const { RangePicker } = DatePicker;

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] h-[65px] text-left">
    <th className="py-3 pl-7 w-[60px] border-y border-[#E9E9E9]">No</th>
    <th className="py-3 pl-5 w-[157px] border-y border-[#E9E9E9]">Menu</th>
    <th className="py-3 pl-5 w-[134px] border-y border-[#E9E9E9]">
      Data Name / ID
    </th>
    <th className="py-3 pl-5 w-[134px] border-y border-[#E9E9E9]">Field</th>
    <th className="py-3 pl-5 w-[85px] border-y border-[#E9E9E9]">Action</th>
    <th className="py-3 pl-5 w-[139px] border-y border-[#E9E9E9]">Old Value</th>
    <th className="py-3 pl-5 w-[139px] border-y border-[#E9E9E9]">New Value</th>
    <th className="py-3 pl-5 w-[122px] border-y border-[#E9E9E9]">
      Updated At
    </th>
    <th className="py-3 pl-5 w-[200px] border-y border-r border-[#E9E9E9]">
      Updated By
    </th>
  </tr>
);

const renderRow = (log, index, startIndex) => (
  <tr
    key={log.log_activity_id}
    className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[65px]"
  >
    <td className="py-2 border-b border-[#E9E9E9] text-center">
      {startIndex + index + 1}
    </td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.menu_name}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.data_name}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.field}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.action}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.old_value}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.new_value}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">{log.updated_at}</td>
    <td className="py-2 pl-5 border-b border-[#E9E9E9]">
      {log.updated_by_email}
    </td>
  </tr>
);

export default function RecordLog() {
  useEffect(() => {
    document.title = 'Record Log - VRMS';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [buttonBgColor, setButtonBgColor] = useState('#FFFFFF');
  const [iconColor, setIconColor] = useState('#DC362E');
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedMenu, setSelectedMenu] = useState([]);

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

  const onClickButton = () => {
    setIsFilterOpen(!isFilterOpen);
    setButtonBgColor(isFilterOpen ? '#FFFFFF' : '#DC362E');
    setIconColor(isFilterOpen ? '#DC362E' : '#FFFFFF');
  };

  const onDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const onMenuChange = (value) => {
    setSelectedMenu(value);
  };

  const clearMenu = () => {
    setSelectedMenu([]);
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
  };

  const displayRender = (labels) => labels.join(' / ');

  return (
    <div>
      <Navbar />
      <div className="p-8 pt-8 flex justify-between gap-4">
        <div className="flex gap-4">
          <Search>
            <input
              type="text"
              placeholder="Search"
              className="py-3 px-2 ms-2 outline-none w-full text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
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
            {isFilterOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-[300px] rounded-[10px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="text-[#BBBBBB] px-4 py-2 text-[12px] font-semibold mx-1 mt-2 mb-2">
                  FILTER
                </div>
                <div className="flex justify-between items-center px-4 mb-2">
                  <Cascader
                    options={options}
                    onChange={onMenuChange}
                    placeholder="Filter by Menu"
                    displayRender={displayRender}
                    value={selectedMenu}
                    style={{
                      width: 'calc(100% - 36px)',
                      height: '40px',
                    }}
                  />
                  <AntButton
                    type="text"
                    icon={<X size="20px" color="#BBBBBB" />}
                    onClick={clearMenu}
                    style={{ marginLeft: '8px' }}
                  />
                </div>
                <div className="flex justify-between items-center px-4 mb-4">
                  <RangePicker
                    style={{ height: '40px', width: 'calc(100% - 36px)' }}
                    onChange={onDateRangeChange}
                    value={dateRange}
                  />
                  <AntButton
                    type="text"
                    icon={<X size="20px" color="#BBBBBB" />}
                    onClick={clearDateRange}
                    style={{ marginLeft: '8px' }}
                  />
                </div>
              </div>
            )}
          </div>
          <DropdownButton
            options={[
              { label: 'SORT' },
              { label: 'Newest' },
              { label: 'Oldest' },
            ]}
            onChange={setSortOrder}
          />
        </div>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          dateRange={dateRange}
          selectedMenu={selectedMenu}
          apiUrl="record-log"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Footer />
    </div>
  );
}
