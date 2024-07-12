import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-iconly';
import api from '../api';

const options = [10, 25, 50, 100];

const BaseTable = ({
  searchQuery = '',
  sortOrder = 'asc',
  dateRange = [null, null],
  selectedMenu = '',
  apiUrl,
  renderRow,
  renderHeader,
  showActions,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getResponseData = (responseData) => {
      if (responseData && Array.isArray(responseData.templates)) {
        return {
          items: responseData.templates,
          totalItems: responseData.totalData || responseData.templates.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.rateTypes)) {
        return {
          items: responseData.rateTypes,
          totalItems: responseData.totalData || responseData.rateTypes.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.submitRating)) {
        return {
          items: responseData.submitRating,
          totalItems:
            responseData.totalData || responseData.submitRating.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.getLog)) {
        return {
          items: responseData.getLog,
          totalItems: responseData.totalData || responseData.getLog.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.pmNotes)) {
        return {
          items: responseData.pmNotes,
          totalItems: responseData.totalData || responseData.pmNotes.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.attachments)) {
        return {
          items: responseData.attachments,
          totalItems: responseData.totalData || responseData.attachments.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.getUser)) {
        return {
          items: responseData.getUser,
          totalItems: responseData.totalData || responseData.getUser.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (
        responseData &&
        Array.isArray(responseData.financialDirectories)
      ) {
        return {
          items: responseData.financialDirectories,
          totalItems: responseData.totalData || responseData.rateTypes.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.tools)) {
        return {
          items: responseData.tools,
          totalItems: responseData.totalData || responseData.tools.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else if (responseData && Array.isArray(responseData.resource)) {
        return {
          items: responseData.resource,
          totalItems: responseData.totalData || responseData.resource.length,
          totalPages:
            responseData.totalPages ||
            Math.ceil(responseData.totalData / itemsPerPage),
        };
      } else {
        return { items: [], totalItems: 0, totalPages: 0 };
      }
    };

    const fetchData = async () => {
      try {
        const fromDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
        const toDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
        const menuParam =
          selectedMenu.length > 0
            ? `&menu=${encodeURIComponent(selectedMenu.join(' - '))}`
            : '';
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/${apiUrl}?search=${encodeURIComponent(searchQuery)}&limit=${itemsPerPage}&page=${currentPage}&sort_order=${sortOrder}&startDate=${fromDate}&endDate=${toDate}${menuParam}`
        );
        const responseData = response.data?.data;

        const { items, totalItems, totalPages } = getResponseData(responseData);
        setData(items);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    };

    fetchData();
  }, [
    searchQuery,
    sortOrder,
    itemsPerPage,
    currentPage,
    apiUrl,
    dateRange,
    selectedMenu,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, sortOrder]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatPageNumber = (number) => {
    return number.toString().padStart(2, '0');
  };

  const paginationRange = () => {
    const rangeSize = 5;
    const current = currentPage;
    let start = Math.max(current - Math.floor(rangeSize / 2), 1);
    let end = Math.min(start + rangeSize - 1, totalPages);

    if (end - start + 1 < rangeSize) {
      start = Math.max(end - rangeSize + 1, 1);
    }

    const range = [];
    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push('...');
      }
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push('...');
      }
      range.push(totalPages);
    }
    return range;
  };

  return (
    <>
      <table className="w-full rounded-t-lg overflow-hidden text-sm shadow-sm border-[#E9E9E9]">
        <thead>{renderHeader()}</thead>
        <tbody>
          {data.map((item, index) =>
            renderRow(item, index, startIndex, showActions)
          )}
        </tbody>
      </table>

      <div className="flex justify-between rounded-b-lg items-center bg-white border-b border-l border-r border-[#E9E9E9]">
        <div className="flex items-center">
          <label
            htmlFor="itemsPerPage"
            className="mr-2 text-sm text-gray-700 py-4 pl-4"
          >
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            className="border-[#E9E9E9] rounded-md text-sm mr-4"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="border-r border-[#E9E9E9] h-[55px] mr-4"></div>
          <div className="text-[12px] text-[#9A9A9A]">{`${startIndex + 1}-${endIndex} of ${totalItems} items`}</div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded-md mx-2"
          >
            <ChevronLeft
              set="light"
              style={{
                color: currentPage === 1 ? '#D8D8D8' : '#000',
              }}
            />
          </button>
          {paginationRange().map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`mx-1 p-1 w-7 h-7 text-[14px] center rounded-md ${currentPage === page ? 'bg-[#DC362E] text-white' : 'text-gray-700'}`}
              >
                {formatPageNumber(page)}
              </button>
            ) : (
              <span key={index} className="mx-1 p-1 text-gray-500">
                {page}
              </span>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="p-1 rounded-md ml-2 mr-4"
          >
            <ChevronRight
              set="light"
              style={{
                color:
                  currentPage === totalPages || totalItems === 0
                    ? '#D8D8D8'
                    : '#000',
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
};

BaseTable.propTypes = {
  searchQuery: PropTypes.string,
  sortOrder: PropTypes.string,
  dateRange: PropTypes.array,
  selectedMenu: PropTypes.array,
  apiUrl: PropTypes.string.isRequired,
  renderRow: PropTypes.func.isRequired,
  renderHeader: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

BaseTable.defaultProps = {
  searchQuery: '',
  sortOrder: 'asc',
  dateRange: [null, null],
  selectedMenu: [],
};

export default BaseTable;
