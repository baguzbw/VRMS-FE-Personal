import { Plus } from '@phosphor-icons/react';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Delete, Edit, PaperPlus } from 'react-iconly';
import api from '../../api';
import ActionButton from '../../components/ActionButton';
import BaseTable from '../../components/BaseTable';
import Button from '../../components/Button';
import DropdownButton from '../../components/DropdownButton';
import Footer from '../../components/Footer';
import Navbar from '../../components/NavBar';
import Popup from '../../components/PopUp/PopUp';
import PopupDelete from '../../components/PopUp/PopUpDelete';
import Search from '../../components/Search';

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[985px] border-y border-[#E9E9E9]">Tool Name</th>
    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function MDTools() {
  useEffect(() => {
    document.title = 'Tools - VRMS';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [openActionId, setOpenActionId] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add'); // 'add' or 'edit'
  const [currentData, setCurrentData] = useState({
    tool_id: null,
    tool_name: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [duplicateToolNameError, setDuplicateToolNameError] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  const handleShowEditPopup = (tool) => {
    setPopupMode('edit');
    setCurrentData(tool ? { ...tool } : null);
    setShowPopup(true);
  };

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setCurrentData({ tool_id: null, tool_name: '' });
    setDuplicateToolNameError(null);
    setShowPopup(true);
  };

  const resetFormState = () => {
    setFormSubmitted(false);
    setDuplicateToolNameError(null);
    setCurrentData({
      tool_id: null,
      tool_name: '',
    });
  };

  const handleSaveTool = async () => {
    setDuplicateToolNameError(null);
    setFormSubmitted(false);

    try {
      const existingToolsResponse = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/master-data/tools`
      );
      const existingToolsData = existingToolsResponse.data;
      const existingTools = Array.isArray(existingToolsData)
        ? existingToolsData
        : [];
      const isDuplicateName = existingTools.some(
        (tool) =>
          tool.tool_name === currentData.tool_name &&
          tool.tool_id !== currentData.tool_id
      );

      if (!currentData.tool_name.trim()) {
        setFormSubmitted(true);
        return;
      }

      if (isDuplicateName) {
        setDuplicateToolNameError('Tool name is already used');
        return;
      }

      if (popupMode === 'add') {
        const response = await api.post(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/tools`,
          {
            tool_name: currentData.tool_name,
          }
        );
        message.success('Tool Added Successfully!');
        console.log('Tool added successfully:', response.data);
      } else if (popupMode === 'edit' && currentData.tool_id) {
        const response = await api.patch(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/tools/${currentData.tool_id}`,
          {
            tool_name: currentData.tool_name,
          }
        );
        message.success('Tool Edited Successfully!');
        console.log('Tool updated successfully:', response.data);
      }

      setShowPopup(false);
      resetFormState();
      refreshTable();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setDuplicateToolNameError('Tool Name is already taken');
        } else if (error.response.status === 409) {
          setDuplicateToolNameError('Tool Name is already used');
        } else {
          console.error('Error saving tool:', error);
        }
      } else {
        console.error('Error saving tool:', error);
      }
    }
  };

  const handleDeleteTool = async () => {
    if (toolToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/tools/${toolToDelete.tool_id}`
        );
        setShowDeleteConfirmation(false); // Close the deletion popup
        setToolToDelete(null); // Clear the selected tool for deletion
        refreshTable();
        message.success('Tool Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting tool:', error);
      }
    }
  };

  const renderRow = (tool, index, startIndex) => (
    <tr
      key={tool.tool_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{tool.tool_name}</td>
      <td className="py-2 border-b border-r border-[#E9E9E9]">
        <ActionButton
          isOpen={openActionId === tool.tool_id}
          toggle={() =>
            setOpenActionId(openActionId === tool.tool_id ? null : tool.tool_id)
          }
          label="ACTION"
        >
          <div className="mx-[10px] -z-50">
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => handleShowEditPopup(tool)}
            >
              <Edit set="two-tone" size={24} className="mx-[10px]" />
              <span className="text-[14px]">Edit</span>
            </button>
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => {
                setToolToDelete(tool);
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
          <Plus className="w-4 h-4 text-white" weight="bold" />
          <span className="text-white">Add Data</span>
        </Button>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl="master-data/tools"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Popup
        show={showPopup}
        onSave={handleSaveTool}
        onClose={() => {
          setShowPopup(false);
          resetFormState();
        }}
        title={popupMode === 'edit' ? 'Edit Data' : 'Add Data'}
        icon={popupMode === 'edit' ? Edit : PaperPlus}
        className="w-[400px]"
      >
        <label className="block mb-1 text-[14px] text-[#9A9A9A]">
          Tool Name
        </label>
        <input
          type="text"
          value={currentData.tool_name}
          onChange={(e) =>
            setCurrentData({
              ...currentData,
              tool_name: e.target.value,
            })
          }
          className={`w-full px-4 py-4 rounded-[15px] mb-2 text-[14px] border focus:outline-none ${
            (duplicateToolNameError || formSubmitted) &&
            !currentData.tool_name.trim()
              ? 'border-[#DC362E] focus:border-[#DC362E]'
              : 'border-[#BBBBBB] focus:border-[#065BCC]'
          }`}
          placeholder="Tool Name"
        />
        {duplicateToolNameError ? (
          <p className="text-[#DC362E] text-[14px]">{duplicateToolNameError}</p>
        ) : formSubmitted && !currentData.tool_name.trim() ? (
          <p className="text-[#DC362E] text-[14px]">
            Tool Name cannot be empty
          </p>
        ) : null}
      </Popup>
      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteTool}
      />
      <Footer />
    </div>
  );
}
