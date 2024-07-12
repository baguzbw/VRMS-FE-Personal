import { FileCsv, FileXls, Plus } from '@phosphor-icons/react';
import { Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  Delete,
  Edit,
  Paper,
  PaperDownload,
  PaperUpload,
  Show,
  Star,
} from 'react-iconly';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import ActionButton from '../../../components/ActionButton';
import BaseTable from '../../../components/BaseTable';
import Button from '../../../components/Button';
import DropdownButton from '../../../components/DropdownButton';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/NavBar';
import Popup from '../../../components/PopUp/PopUp';
import PopupDelete from '../../../components/PopUp/PopUpDelete';
import Search from '../../../components/Search';

const { Dragger } = Upload;

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[81px] border-y border-[#E9E9E9]">Username</th>
    <th className="py-3 w-[237px] border-y border-[#E9E9E9]">Full Name</th>
    <th className="py-3 w-[257px] border-y border-[#E9E9E9]">Email</th>
    <th className="py-3 w-[161px] border-y border-[#E9E9E9]">Whatsapp</th>
    <th className="py-3 w-[137px] border-y border-[#E9E9E9]">Average Rating</th>
    <th className="py-3 w-[119px] border-y border-[#E9E9E9]">Created At</th>
    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function Translation() {
  useEffect(() => {
    document.title = ' Freelance / Translation - VRMS';
  });

  const fetchResourceDetails = (id, action) => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${id}`)
      .then((response) => {
        if (response.data.code === 200) {
          if (action === 'show') {
            navigate(`/resource-manager/translation/${id}/show`, {
              state: { resource: response.data.data.freelance },
            });
          } else if (action === 'edit') {
            navigate(`/resource-manager/translation/${id}/edit`, {
              state: { resource: response.data.data.freelance },
            });
          }
        } else {
          console.error('Error fetching details: ', response.data.message);
        }
      })
      .catch((error) => {
        console.error(
          'There was an error fetching the freelance details!',
          error
        );
      });
  };

  const [openActionId, setOpenActionId] = useState(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State untuk menampilkan pop-up konfirmasi
  const [resourceToDelete, setResourceToDelete] = useState(null); // State untuk resource yang akan dihapus
  const navigate = useNavigate();
  const [tableKey, setTableKey] = useState(0);
  const [draggerVisible, setDraggerVisible] = useState(false);

  const toggleActionDropdown = (id) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const handleDeleteResource = async () => {
    if (resourceToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${resourceToDelete.freelance_id}`
        );
        setShowDeleteConfirmation(false);
        setResourceToDelete(null);
        refreshTable();
        message.success('Resource Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.code === 200) {
        message.success(
          `${file.name} file uploaded and processed successfully.`
        );
        onSuccess(null, file); 
      } else {
        message.success(`${response.data.message}`);
        onError(new Error(response.data.message));
      }
    } catch (error) {
      console.error('Error uploading and processing file:', error);
      onError(error);
    }

    setDraggerVisible(false);
  };

  const refreshTable = () => {
    setTableKey((prevKey) => prevKey + 1);
  };

  const renderRow = (resource, index, startIndex, showActions) => (
    <tr
      key={resource.freelance_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{resource.username}</td>
      <td className="py-2 border-b border-[#E9E9E9]">
        {resource.full_name.length > 15
          ? `${resource.full_name.substring(0, 15)}...`
          : resource.full_name}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">
        {resource.email.length > 20
          ? `${resource.email.substring(0, 20)}...`
          : resource.email}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{resource.whatsapp}</td>
      <td className="py-2 border-b border-[#E9E9E9]">
        <div className="flex items-center">
          <Star set="bold" primaryColor="#FFD155" size={18} />
          {resource.average_rating}
          <span className="ml-1 text-[#BBBBBB]">/ 5</span>
        </div>
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">
        {resource.created_at}
      </td>
      {showActions && (
        <td className="py-2 border-b border-r border-[#E9E9E9]">
          <ActionButton
            isOpen={openActionId === resource.freelance_id}
            toggle={() => toggleActionDropdown(resource.freelance_id)}
            label="ACTION"
          >
            <div className="mx-[10px]">
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() =>
                  fetchResourceDetails(resource.freelance_id, 'show')
                }
              >
                <Show set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Show</span>
              </button>
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() =>
                  fetchResourceDetails(resource.freelance_id, 'edit')
                }
              >
                <Edit set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Edit</span>
              </button>
              {/* Menampilkan pop-up konfirmasi saat tombol Delete diklik */}
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() => {
                  setResourceToDelete(resource);
                  setShowDeleteConfirmation(true);
                }}
              >
                <Delete set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Delete</span>
              </button>
              <hr className=" border-[#E9E9E9] w-full" />
              <button
                className="flex mt-2 items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() =>
                  navigate(
                    `/resource-manager/translation/submit-rating/${resource.freelance_id}`
                  )
                }
              >
                <Star set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Submit Rating</span>
              </button>
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() =>
                  navigate(
                    `/resource-manager/translation/PM-notes/${resource.freelance_id}`
                  )
                }
              >
                <Paper set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">PM Notes</span>
              </button>
            </div>
          </ActionButton>
        </td>
      )}
    </tr>
  );

  return (
    <div>
      <Navbar />
      <div className="p-8 flex justify-between gap-4">
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
        <div className="flex gap-4">
          <Button
            className="bg-white w-[131px] h-[48px] border border-[#E9E9E9] hover:bg-gray-50"
            onClick={() => setDraggerVisible(true)}
          >
            <PaperUpload className="w-4 h-4 text-[#DC362E]" set="two-tone" />
            <span className="text-[#DC362E]">Import</span>
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
              multiple={false}
              customRequest={handleUpload}
              maxCount={1}
              accept=".csv,.xlsx"
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
                <span className="text-[#DC362E]"> <br />browse</span>
              </p>
              <p className="ant-upload-hint" style={{ fontSize: '12px' }}>
                CSV or XLSX formats, up to 2MB
              </p>
            </Dragger>
          </Popup>
          <div className="relative">
            <Button
              className="bg-white border w-[131px] h-[48px] border-[#E9E9E9] hover:bg-gray-50"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            >
              <PaperDownload
                className="w-4 h-4 text-[#DC362E]"
                set="two-tone"
              />
              <span className="text-[#DC362E]">Export</span>
            </Button>
            {exportDropdownOpen && (
              <div className="absolute top-[60px] right-0 bg-white border border-gray-200 rounded-[10px] shadow-md w-[131px] h-[110px]">
                <ul>
                  <li
                    className="m-2 py-2 px-3 cursor-pointer hover:bg-[#F4F7FE] flex items-center rounded-[10px]"
                    onClick={() =>
                      (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/export/xlsx`)
                    }
                  >
                    <FileXls size={24} />
                    <span className="ml-2">XLS</span>
                  </li>
                  <li
                    className="m-2 py-2 px-3 cursor-pointer hover:bg-[#F4F7FE] flex items-center rounded-[10px]"
                    onClick={() =>
                      (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/export/csv`)
                    }
                  >
                    <FileCsv size={24} />
                    <span className="ml-2">CSV</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Button
            className="bg-[#DC362E] border w-[131px] h-[48px] border-[#E9E9E9] hover:bg-[#DC362E]"
            onClick={() => navigate('/resource-manager/translation/add')}
          >
            <Plus className="w-4 h-4 text-white" weight="bold" />
            <span className="text-white">Add</span>
          </Button>
        </div>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl="freelances/translation"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteResource}
      />
      <Footer />
    </div>
  );
}
