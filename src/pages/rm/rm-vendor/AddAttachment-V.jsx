import { FloppyDisk, Plus } from '@phosphor-icons/react';
import { Upload, message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Delete, Download, Folder, PaperUpload } from 'react-iconly';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import ActionButton from '../../../components/ActionButton';
import BaseTable from '../../../components/BaseTable';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/NavBar';
import Popup from '../../../components/PopUp/PopUp';
import PopupDelete from '../../../components/PopUp/PopUpDelete';

const { Dragger } = Upload;

export default function RMVendorAttachment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      uploadFiles();
    }
  }, [files]);

  const refreshTable = () => {
    setTableKey((prevKey) => prevKey + 1);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('attachment', file);
    });

    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/attachments`,
        data: formData,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Files uploaded successfully.');
        setFiles([]);
        setDraggerVisible(false);
        refreshTable();
      } else {
        message.error('File upload failed.');
      }
    } catch (error) {
      message.error('File upload failed.');
      console.error('Upload error:', error);
      if (error.response) {
        console.error('Error response:', error.response);
      }
    }
  };

  useEffect(() => {
    document.title = 'Resource Manager - VRMS';
  }, []);

  const handleSave = () => {
    message.success('Data added successfully!');
    navigate('/resource-manager/vendor');
  };

  // Data Information
  const [draggerVisible, setDraggerVisible] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDelete = async () => {
    if (fileToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/attachments/${fileToDelete.filename}`
        );
        setShowDeleteConfirmation(false);
        setFileToDelete(null);
        refreshTable();
        message.success('File Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const renderRow = (attach, index, startIndex) => (
    <tr
      key={attach.filename}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[60px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{attach.originalname}</td>
      <td className="py-2 border-b border-r border-[#E9E9E9]">
        <ActionButton
          isOpen={openActionId === attach.filename}
          toggle={() =>
            setOpenActionId(
              openActionId === attach.filename ? null : attach.filename
            )
          }
          label="ACTION"
        >
          <div className="mx-[10px] -z-50">
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/attachments/${attach.filename}/download`;
              }}
            >
              <Download set="two-tone" size={24} className="mx-[10px]" />
              <span className="text-[14px]">Download</span>
            </button>
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => {
                setFileToDelete(attach);
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

  const renderHeader = () => (
    <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[60px]">
      <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
        No.
      </th>
      <th className="py-3 w-[598px] border-y border-[#E9E9E9]">File Name</th>
      <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">
        Action
      </th>
    </tr>
  );

  return (
    <div>
      <Navbar />
      <div className="px-8 pt-10 pb-8">
        <div className="w-full bg-white shadow-md rounded-lg p-8 flex flex-col items-center">
          {/* Attachment Section */}
          <section className="w-full mt-2">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Folder size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Attachment
              </h2>
            </div>
            <div className="w-full flex justify-end mb-6">
              <Button
                className="bg-[#DC362E] border w-[131px] h-[48px] border-[#E9E9E9] hover:bg-[#DC362E] ml-4"
                onClick={() => setDraggerVisible(true)}
              >
                <Plus className="w-4 h-4 text-white" weight="bold" />
                <span className="text-white">Add</span>
              </Button>
              <Popup
                show={draggerVisible}
                onClose={() => setDraggerVisible(false)}
                title="Import"
                icon={PaperUpload}
                className="w-[400px]"
              >
                <Dragger
                  name="file"
                  multiple={true}
                  maxCount={5}
                  beforeUpload={(file) => {
                    setFiles((prevFiles) => [...prevFiles, file]);
                    return false; // Prevent automatic upload
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <PaperUpload
                      className="mx-auto mt-2"
                      size="large"
                      set="two-tone"
                    />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: '16px' }}>
                    Choose a file or drag & drop it here or
                    <span className="text-[#DC362E]">
                      <br />
                      browse
                    </span>
                  </p>
                  <p className="ant-upload-hint" style={{ fontSize: '12px' }}>
                    PDF or Image formats, up to 2MB
                  </p>
                </Dragger>
              </Popup>
            </div>
            <div className="w-full">
              <BaseTable
                key={tableKey}
                apiUrl={`vendors/${id}/attachments`}
                renderRow={renderRow}
                renderHeader={renderHeader}
                showActions={true}
              />
            </div>
          </section>
          <div className="w-full flex justify-end mt-14">
            <Button
              className="bg-[#DC362E] border w-[131px] h-[48px] hover:bg-[#DC362E]"
              onClick={handleSave}
            >
              <FloppyDisk
                className="w-4 h-4 text-white"
                size={24}
                weight="bold"
              />
              <span className="text-white">Save</span>
            </Button>
          </div>
        </div>
      </div>
      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDelete}
      />
      <Footer />
    </div>
  );
}
