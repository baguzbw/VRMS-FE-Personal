import { Plus } from '@phosphor-icons/react';
import { message, Modal, Upload } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { Delete, Download, Edit, PaperPlus, PaperUpload } from 'react-iconly';
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

const { Dragger } = Upload;

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[400px] border-y border-[#E9E9E9]">
      Financial Directory Name
    </th>
    <th className="py-3 w-[400px] border-y border-[#E9E9E9] text-center">
      Total Files
    </th>
    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function MDFinancial() {
  useEffect(() => {
    document.title = 'Financial Directory - VRMS';
  });

  const [openActionId, setOpenActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add');
  const [originalFiles, setOriginalFiles] = useState([]);
  const [currentData, setCurrentData] = useState({
    financial_directory_id: null,
    financial_directory_name: '',
  });
  const [sortOrder, setSortOrder] = useState('newest');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [financialToDelete, setFinancialToDelete] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [duplicateNameError, setDuplicateNameError] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  const handleDeleteFile = async (fileId, financialDirectoryId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this file?',
      content: 'This action cannot be undone.',
      okButtonProps: {
        style: {
          backgroundColor: '#DC362E',
          color: '#FFFFFF',
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: '#FFFFFF',
          borderColor: '#BBBBBB',
        },
      },
      onOk: async () => {
        try {
          const response = await api.delete(
            `${import.meta.env.VITE_API_BASE_URL}/master-data/financial-directories/${financialDirectoryId}/${fileId}`
          );
          if (response.status === 200) {
            message.success('File deleted successfully');
            setUploadedFiles((files) =>
              files.filter((file) => file.uid !== fileId)
            );
          } else {
            throw new Error('Failed to delete the file');
          }
          refreshTable();
        } catch (error) {
          console.log('Error deleting file: ' + error.message);
        }
      },
      onCancel() {
        console.log('Deletion cancelled');
      },
    });
  };

  const toggleActionDropdown = (financial_directory_id) => {
    setOpenActionId(
      openActionId === financial_directory_id ? null : financial_directory_id
    );
  };

  const handleSaveFinancial = async () => {
    setDuplicateNameError(null);
    setFormSubmitted(false);

    // Validate the financial directory name
    if (!currentData.financial_directory_name.trim()) {
      setFormSubmitted(true);
      return;
    }

    // Validate that at least one file is uploaded
    if (uploadedFiles.length === 0) {
      message.error('Please upload at least one file.');
      return;
    }

    try {
      // Fetch existing financial directories to check for duplicates
      const existingDirectoriesResponse = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/master-data/financial-directories`
      );
      const existingDirectoriesData = existingDirectoriesResponse.data;
      const existingDirectories = Array.isArray(existingDirectoriesData)
        ? existingDirectoriesData
        : [];

      // Check if the financial directory name is a duplicate
      const isDuplicateName = existingDirectories.some(
        (directory) =>
          directory.financial_directory_name ===
            currentData.financial_directory_name &&
          directory.financial_directory_id !==
            currentData.financial_directory_id
      );

      // Set duplicate name error if a duplicate is found
      if (isDuplicateName) {
        setDuplicateNameError('Financial directory name is already used');
        return;
      }

      // Prepare the URL and method for saving the financial directory
      let url = `${import.meta.env.VITE_API_BASE_URL}/master-data/financial-directories`;
      let method = 'POST';
      if (popupMode === 'edit') {
        url += `/${currentData.financial_directory_id}`;
        method = 'PATCH';
      }

      // Prepare the form data
      const formData = new FormData();
      (currentData.financial_directory_files || []).forEach((file) => {
        formData.append(
          'existing_files',
          JSON.stringify({
            id_file: file.id_file,
            filename: file.filename,
            originalname: file.originalname,
          })
        );
      });
      uploadedFiles.forEach((file) => {
        if (!file.url) {
          formData.append('financial_directory_files', file.originFileObj);
        }
      });
      formData.append(
        'financial_directory_name',
        currentData.financial_directory_name
      );

      // Send the request to save the financial directory
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      // Handle the successful save
      const data = response.data;
      console.log('Success:', data);
      setShowPopup(false);
      setUploadedFiles([]);
      const successMessage =
        method === 'POST'
          ? 'Directory Added Successfully'
          : 'Directory Edited Successfully';
      message.success(successMessage);
      refreshTable();
    } catch (error) {
      // Handle errors
      console.error('Caught error:', error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message ||
          'Financial directory name is already used';
        setDuplicateNameError(errorMessage);
      } else {
        setDuplicateNameError('Financial directory name is already used');
      }
    }
  };

  const handleShowEditPopup = (data) => {
    setPopupMode('edit');
    setDuplicateNameError(null);
    const files = data.financial_directory_files || [];
    const fileList = files.map((file) => ({
      uid: file.id_file,
      name: file.filename,
      status: 'done',
      url: `${import.meta.env.VITE_API_BASE_URL}/master-data/financial-directories/${data.financial_directory_id}/${file.id_file}/download`,
    }));
    setOriginalFiles([...fileList]);
    setCurrentData({
      financial_directory_id: data.financial_directory_id,
      financial_directory_name: data.financial_directory_name,
      financial_directory_files: files,
    });
    setUploadedFiles(fileList);
    setShowPopup(true);
  };

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setDuplicateNameError(null);
    setCurrentData({ financial_directory_name: '' });
    setUploadedFiles([]);
    setShowPopup(true);
  };

  const handleDeleteFinancial = async () => {
    if (financialToDelete && financialToDelete.financial_directory_id) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/financial-directories/${financialToDelete.financial_directory_id}`
        );
        setShowDeleteConfirmation(false);
        setFinancialToDelete(null);
        refreshTable();
        message.success('Directory Deleted Successfully');
      } catch (error) {
        console.error('Error deleting financial directory:', error);
      }
    }
  };

  const renderRow = (financialDirectories, index, startIndex, showActions) => {
    return (
      <tr
        key={financialDirectories.financial_directory_id}
        className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
      >
        <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
          {startIndex + index + 1}
        </td>
        <td className="py-2 border-b border-[#E9E9E9] overflow-hidden whitespace-nowrap text-ellipsis">
          {financialDirectories.financial_directory_name.length > 25
            ? `${financialDirectories.financial_directory_name.substring(0, 25)}...`
            : financialDirectories.financial_directory_name}
        </td>
        <td className="py-2 border-b border-[#E9E9E9] text-center">
          {financialDirectories.financial_directory_total}
        </td>
        {showActions && (
          <td className="py-2 border-b border-r border-[#E9E9E9]">
            <ActionButton
              isOpen={
                openActionId === financialDirectories.financial_directory_id
              }
              toggle={() =>
                toggleActionDropdown(
                  financialDirectories.financial_directory_id
                )
              }
              label="ACTION"
            >
              <div className="mx-[10px]">
                <button
                  className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                  onClick={() => handleShowEditPopup(financialDirectories)}
                >
                  <Edit set="two-tone" size={24} className="mx-[10px]" />
                  <span className="text-[14px]">Edit</span>
                </button>
                <button
                  className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                  onClick={() => {
                    setFinancialToDelete(financialDirectories);
                    setShowDeleteConfirmation(true);
                  }}
                >
                  <Delete set="two-tone" size={24} className="mx-[10px]" />
                  <span className="text-[14px]">Delete</span>
                </button>
              </div>
            </ActionButton>
          </td>
        )}
      </tr>
    );
  };

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
          apiUrl="master-data/financial-directories"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Popup
        show={showPopup}
        onSave={handleSaveFinancial}
        onClose={() => {
          if (popupMode === 'edit' && uploadedFiles.length === 0) {
            message.error('Please upload at least one file before closing.');
          } else {
            setShowPopup(false);
            setUploadedFiles([...originalFiles]);
            setFormSubmitted(false);
            setDuplicateNameError(null);
          }
        }}
        title={
          popupMode === 'edit'
            ? 'Edit Financial Directory'
            : 'Add Financial Directory'
        }
        icon={popupMode === 'edit' ? Edit : PaperPlus}
        className="w-[450px]"
      >
        <label className="block mb-1 text-[14px] text-[#9A9A9A]">
          Financial Directory Name
        </label>
        <input
          type="text"
          value={currentData.financial_directory_name}
          onChange={(e) =>
            setCurrentData({
              ...currentData,
              financial_directory_name: e.target.value,
            })
          }
          className={`w-full px-4 py-4 rounded-[15px] mb-2 text-[14px] border focus:outline-none ${
            (duplicateNameError || formSubmitted) &&
            !currentData.financial_directory_name.trim()
              ? 'border-[#DC362E] focus:border-[#DC362E]'
              : 'border-[#BBBBBB] focus:border-[#065BCC]'
          }`}
          placeholder="Financial Directory Name"
        />
        {duplicateNameError ? (
          <p className="text-[#DC362E] mb-2 text-[14px]">
            {duplicateNameError}
          </p>
        ) : formSubmitted && !currentData.financial_directory_name.trim() ? (
          <p className="text-[#DC362E] mb-2 text-[14px]">
            Financial Directory Name cannot be empty
          </p>
        ) : null}

        <Dragger
          name="financial_directory_files"
          multiple
          fileList={uploadedFiles}
          showUploadList={{
            showDownloadIcon: true,
            downloadIcon: (file) => (
              <Download
                size={20}
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(file.url, '_blank');
                }}
              />
            ),
            showRemoveIcon: true,
            removeIcon: (file) => (
              <Delete
                size={20}
                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteFile(
                    file.uid,
                    currentData.financial_directory_id
                  );
                  setUploadedFiles((prevFiles) =>
                    prevFiles.filter((f) => f.uid !== file.uid)
                  );
                }}
              />
            ),
          }}
          beforeUpload={(file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('File must be smaller than 2MB!');
              return Upload.LIST_IGNORE;
            }
            setUploadedFiles([...uploadedFiles, file]);
            return false;
          }}
          listType="picture"
          onChange={(info) => {
            const { file, fileList: newFileList } = info;
            if (file.status === 'removed') {
              setUploadedFiles(newFileList.filter((f) => f.uid !== file.uid));
            } else {
              setUploadedFiles(newFileList);
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <PaperUpload className="mx-auto mt-2" size="large" set="two-tone" />
          </p>
          <p className="ant-upload-text" style={{ fontSize: '16px' }}>
            Choose a file or drag & drop it here or
            <span className="text-[#DC362E]">
              <br />
              browse
            </span>
          </p>
          <p className="ant-upload-hint" style={{ fontSize: '12px' }}>
            All formats, up to 2MB
          </p>
        </Dragger>
      </Popup>

      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteFinancial}
      />
      <Footer />
    </div>
  );
}
