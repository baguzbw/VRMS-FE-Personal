import { Plus } from '@phosphor-icons/react';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Delete, Edit, PaperPlus } from 'react-iconly';
import ActionButton from '../../components/ActionButton';
import BaseTable from '../../components/BaseTable';
import Button from '../../components/Button';
import DropdownButton from '../../components/DropdownButton';
import Footer from '../../components/Footer';
import Navbar from '../../components/NavBar';
import Popup from '../../components/PopUp/PopUp';
import PopupDelete from '../../components/PopUp/PopUpDelete';
import Search from '../../components/Search';
import api from '../../api';

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[985px] border-y border-[#E9E9E9]">Rate Name</th>
    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function MDRate() {
  useEffect(() => {
    document.title = ' Rate Type - VRMS';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [openActionId, setOpenActionId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add'); // 'add' or 'edit'
  const [currentData, setCurrentData] = useState({
    rate_type_id: null,
    rate_type_name: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [rateToDelete, setRateToDelete] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [duplicateRateNameError, setDuplicateRateNameError] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  const handleShowEditPopup = (rate_type) => {
    setPopupMode('edit');
    setCurrentData(rate_type ? { ...rate_type } : null);
    setShowPopup(true);
  };

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setCurrentData({ rate_type_id: null, rate_type_name: '' });
    setShowPopup(true);
  };

  const resetFormState = () => {
    setFormSubmitted(false);
    setDuplicateRateNameError(null);
    setCurrentData({
      rate_type_id: null,
      rate_type_name: '',
    });
  };

  const handleSaveRate = async () => {
    setDuplicateRateNameError(null);
    setFormSubmitted(false);

    try {
      const existingRateResponse = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types`
      );
      const existingRateData = existingRateResponse.data;
      const existingRate = Array.isArray(existingRateData)
        ? existingRateData
        : [];
      const isDuplicateName = existingRate.some(
        (rate) =>
          rate.rate_type_name === currentData.rate_type_name &&
          rate.rate_type_id !== currentData.rate_type_id
      );

      if (!currentData.rate_type_name.trim()) {
        setFormSubmitted(true);
        return;
      }

      if (isDuplicateName) {
        setDuplicateRateNameError('Rate Name is already used');
        return;
      }

      if (popupMode === 'add') {
        const response = await api.post(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types`,
          {
            rate_type_name: currentData.rate_type_name,
          }
        );
        message.success('Rate Type Added Successfully!');
        console.log('Rate Type added successfully:', response.data);
        refreshTable();
      } else if (popupMode === 'edit' && currentData.rate_type_id) {
        const response = await api.patch(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types/${currentData.rate_type_id}`,
          {
            rate_type_name: currentData.rate_type_name,
          }
        );
        message.success('Rate Type Edited Successfully!');
        console.log('Rate updated successfully:', response.data);
        refreshTable();
      }
      setShowPopup(false);
      resetFormState();
      refreshTable();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setDuplicateRateNameError('Rate Name is already taken');
        } else if (error.response.status === 409) {
          setDuplicateRateNameError('Rate Name is already used');
        } else {
          console.error('Error saving rate:', error);
        }
      } else {
        console.error('Error saving rate:', error);
      }
    }
  };

  const handleDeleteRate = async () => {
    if (rateToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types/${rateToDelete.rate_type_id}`
        );
        setShowDeleteConfirmation(false); // Close the deletion popup
        setRateToDelete(null); // Clear the selected rate for deletion
        refreshTable();
        message.success('Rate Type Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting rate:', error);
      }
    }
  };

  const renderRow = (rate, index, startIndex) => (
    <tr
      key={rate.rate_type_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{rate.rate_type_name}</td>
      <td className="py-2 border-b border-r border-[#E9E9E9]">
        <ActionButton
          isOpen={openActionId === rate.rate_type_id}
          toggle={() =>
            setOpenActionId(
              openActionId === rate.rate_type_id ? null : rate.rate_type_id
            )
          }
          label="ACTION"
        >
          <div className="mx-[10px]">
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => handleShowEditPopup(rate)}
            >
              <Edit set="two-tone" size={24} className="mx-[10px]" />
              <span className="text-[14px]">Edit</span>
            </button>
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => {
                setRateToDelete(rate);
                setShowDeleteConfirmation(true);
              }}
            >
              <Delete set="two-tone" size={24} className="mx-[10px]" />
              <span className="text-[14px]">Delete</span>
            </button>
          </div>
        </ActionButton>
      </td>
    </tr>
  );

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
          <DropdownButton
            options={[
              { label: 'SORT' },
              { label: 'Newest' },
              { label: 'Oldest' },
            ]}
            onChange={setSortOrder}
          />
        </div>
        <Button
          className="bg-[#DC362E] border w-[131px] h-[48px] border-[#E9E9E9] hover:bg-[#DC362E]"
          onClick={handleShowAddPopup}
        >
          <Plus className="w-4 h-4 text-white" size={24} weight="bold" />
          <span className="text-white">Add Data</span>
        </Button>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl="master-data/rate-types"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Popup
        show={showPopup}
        onSave={handleSaveRate}
        onClose={() => {
          setShowPopup(false);
          resetFormState();
        }}
        title={popupMode === 'edit' ? 'Edit Data' : 'Add Data'}
        icon={popupMode === 'edit' ? Edit : PaperPlus}
        className="w-[400px]"
      >
        <label className="block mb-1 text-[14px] text-[#9A9A9A]">
          Rate Type Name
        </label>
        <input
          type="text"
          value={currentData.rate_type_name}
          onChange={(e) =>
            setCurrentData({
              ...currentData,
              rate_type_name: e.target.value,
            })
          }
          className={`w-full px-4 py-4 rounded-[15px] mb-2 text-[14px] border focus:outline-none ${
            (duplicateRateNameError || formSubmitted) &&
            !currentData.rate_type_name.trim()
              ? 'border-[#DC362E] focus:border-[#DC362E]'
              : 'border-[#BBBBBB] focus:border-[#065BCC]'
          }`}
          placeholder="Rate Name"
        />
        {duplicateRateNameError ? (
          <p className="text-[#DC362E] text-[14px]">{duplicateRateNameError}</p>
        ) : formSubmitted && !currentData.rate_type_name.trim() ? (
          <p className="text-[#DC362E] text-[14px]">
            Rate Name cannot be empty
          </p>
        ) : null}
      </Popup>
      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteRate}
      />
      <Footer />
    </div>
  );
}
