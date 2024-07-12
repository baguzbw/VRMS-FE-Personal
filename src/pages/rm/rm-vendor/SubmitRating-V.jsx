import { Plus } from '@phosphor-icons/react';
import { Rate, Upload, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  Delete,
  Download,
  PaperPlus,
  PaperUpload,
  Show,
  Star,
} from 'react-iconly';
import { useParams } from 'react-router-dom';
import api from '../../../api';
import ActionButton from '../../../components/ActionButton';
import BaseTable from '../../../components/BaseTable';
import Button from '../../../components/Button';
import DropdownButton from '../../../components/DropdownButton';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/NavBar';
import Popup from '../../../components/PopUp/PopUp';
import Search from '../../../components/Search';

const { Dragger } = Upload;

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[50px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 pl-5 w-[100px] border-y border-[#E9E9E9]">
      Review Date
    </th>
    <th className="py-3 w-[120px] border-y border-[#E9E9E9]">Project Name</th>
    <th className="py-3 w-[287px] border-y border-[#E9E9E9]">Review</th>
    <th className="py-3 pl-10 w-[100px] border-y border-[#E9E9E9]">Rating</th>
    <th className="py-3 w-[161px] border-y border-[#E9E9E9]">Submitted By</th>
    <th className="py-3 w-[60px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function SubmitRatingVendor() {
  const { id } = useParams();
  useEffect(() => {
    document.title = 'Vendor - VRMS';
  });

  const [openActionId, setOpenActionId] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [currentData, setCurrentData] = useState({
    submit_rating_id: null,
    project_name: '',
    review: '',
    rating: '',
    submited_by: '',
    files: [],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add');
  const [currentRating, setCurrentRating] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isFieldEmpty = (field) => {
    return !field || field.trim() === '';
  };

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setShowPopup(true);
    setCurrentData({
      submit_rating_id: null,
      project_name: '',
      review: '',
      rating: '',
      submited_by: '',
      files: [],
    });
    setCurrentRating(0);
    setFormSubmitted(false);
  };

  const toggleActionDropdown = (id) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const fetchRatingDetails = async (ratingId) => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/ratings/${ratingId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('There was an error fetching rating details!', error);
    }
  };

  const handleShowDetailPopup = async (rating) => {
    const ratingDetails = await fetchRatingDetails(rating.submit_rating_id);

    setPopupMode('show');
    setShowPopup(true);
    setCurrentData({
      submit_rating_id: ratingDetails.submit_rating_id,
      project_name: ratingDetails.project_name,
      review: ratingDetails.review,
      rating: ratingDetails.rating,
      submited_by: ratingDetails.submited_by,
      files: ratingDetails.files,
    });
    setCurrentRating(ratingDetails.rating);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_name', currentData.project_name);
    formData.append('review', currentData.review);
    formData.append('rating', currentRating);
    formData.append('submited_by', currentData.submited_by);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/ratings`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      message.success('Rating and File Added Successfully!');
      console.log('Rating and file added successfully:', response.data);
      setShowPopup(false);
      refreshTable();
    } catch (error) {
      message.error('Failed to add rating and file');
      console.error('There was an error!', error);
    }
  };

  const handleSaveRating = async () => {
    setFormSubmitted(true);

    if (
      isFieldEmpty(currentData.project_name) ||
      isFieldEmpty(currentData.review) ||
      currentRating === 0
    ) {
      message.error('Please fill in all required fields');
      return;
    }

    if (currentData.file) {
      await handleFileUpload(currentData.file);
    } else {
      const newRating = {
        project_name: currentData.project_name,
        review: currentData.review,
        rating: currentRating,
        submited_by: currentData.submited_by,
      };

      try {
        await api.post(
          `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/ratings`,
          newRating
        );
        message.success('Rating added successfully');
        setShowPopup(false);
        refreshTable();
      } catch (error) {
        console.error('There was an error!', error);
        message.error('Failed to add rating');
      }
    }
  };

  const handleFileChange = (file) => {
    setCurrentData({
      ...currentData,
      file: file,
    });
  };

  const renderRow = (rating, index, startIndex, showActions) => (
    <tr
      key={rating.submit_rating_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-3 pl-5 border-b border-[#E9E9E9]">
        {rating.created_at}
      </td>
      <td className="py-3 border-b border-[#E9E9E9]">{rating.project_name}</td>
      <td className="py-3 border-b border-[#E9E9E9]">
        {rating.review.length > 200
          ? `${rating.review.substring(0, 200)}...`
          : rating.review}
      </td>
      <td className="py-3 pl-10 border-b border-[#E9E9E9]">
        <div className="flex items-center">
          <Star set="bold" primaryColor="#FFD155" size={18} />
          {rating.rating}
          <span className="ml-1 text-[#BBBBBB]">/ 5</span>
        </div>
      </td>
      <td className="py-3 border-b border-[#E9E9E9]">
        {rating.submited_by.length > 20
          ? `${rating.submited_by.substring(0, 20)}...`
          : rating.submited_by}
      </td>
      {showActions && (
        <td className="py-2 border-b border-r border-[#E9E9E9]">
          <ActionButton
            isOpen={openActionId === rating.submit_rating_id}
            toggle={() => toggleActionDropdown(rating.submit_rating_id)}
            label="ACTION"
          >
            <div className="mx-[10px]">
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() => handleShowDetailPopup(rating)}
              >
                <Show set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Show</span>
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
            className="bg-[#DC362E] border w-[160px] h-[48px] border-[#E9E9E9] hover:bg-[#DC362E]"
            onClick={handleShowAddPopup}
          >
            <Plus className="w-4 h-4 text-white" weight="bold" />
            <span className="text-white">Add Review</span>
          </Button>
        </div>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl={`vendors/${id}/ratings`}
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Popup
        show={showPopup}
        onSave={
          popupMode === 'add' ? handleSaveRating : () => setShowPopup(false)
        }
        onClose={() => setShowPopup(false)}
        title={popupMode === 'add' ? 'Add Review' : 'Show Details'}
        icon={popupMode === 'add' ? PaperPlus : Show}
        className="w-[550px]"
      >
        <div className="flex justify-center items-center">
          <Rate
            allowHalf
            onChange={(value) => {
              setCurrentRating(value);
            }}
            value={currentRating}
            style={{ fontSize: 60, marginInline: 'auto' }}
            disabled={popupMode === 'show'}
          />
        </div>
        <br />
        <p className="text-[16px] text-center ">
          Your Rating :
          <span className="font-semibold text-[21px]"> {currentRating}</span>
          <span className="text-[16px] text-[#9A9A9A]">/5</span>
        </p>
        {formSubmitted && currentRating === 0 && (
          <p className="text-[#DC362E] text-center mb-2 text-[14px]">
            Please provide a rating
          </p>
        )}
        <div className="relative">
          <label className="block mb-1 text-[14px] text-[#9A9A9A]">
            Project Name
          </label>
          <input
            type="text"
            className={`w-full px-4 py-4 rounded-[15px] mb-2 text-[14px] border focus:outline-none ${
              formSubmitted && isFieldEmpty(currentData.project_name)
                ? 'border-[#DC362E] focus:border-[#DC362E]'
                : 'border-[#BBBBBB] focus:border-[#065BCC]'
            }`}
            placeholder="Project Name"
            value={currentData.project_name}
            onChange={(e) =>
              setCurrentData({ ...currentData, project_name: e.target.value })
            }
            disabled={popupMode === 'show'}
          />
          {formSubmitted && isFieldEmpty(currentData.project_name) && (
            <p className="text-[#DC362E] mb-2 text-[14px]">
              This cannot be empty
            </p>
          )}
        </div>
        <div className="relative">
          <label className="block mb-1 text-[14px] text-[#9A9A9A]">
            Review
          </label>
          <textarea
            className={`w-full h-32 px-4 py-2 mb-4 rounded-[15px] text-[14px] border focus:outline-none ${
              formSubmitted && isFieldEmpty(currentData.review)
                ? 'border-[#DC362E] focus:border-[#DC362E]'
                : 'border-[#BBBBBB] focus:border-[#065BCC]'
            }`}
            placeholder="Write your review here..."
            value={currentData.review || ''}
            onChange={(e) =>
              setCurrentData({ ...currentData, review: e.target.value })
            }
            disabled={popupMode === 'show'}
          />
          {formSubmitted && isFieldEmpty(currentData.review) && (
            <p className="text-[#DC362E] mb-2 text-[14px]">
              This cannot be empty
            </p>
          )}
          <p className="text-[12px] mb-4 text-[#9A9A9A]">
            Maximum 200 characters
          </p>
        </div>
        <Dragger
          name="submit_rating_files"
          multiple={false}
          fileList={currentData.file ? [currentData.file] : []}
          showUploadList={{
            showDownloadIcon: true,
            downloadIcon: <Download size={16} primaryColor="#0553BA" />,
            showRemoveIcon: true,
            removeIcon: <Delete size={16} primaryColor="#DC362E" />,
          }}
          listType="picture"
          beforeUpload={(file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('File must be smaller than 2MB!');
              return Upload.LIST_IGNORE;
            }
            handleFileChange(file);
            return false;
          }}
          onRemove={() => {
            setCurrentData({ ...currentData, file: null });
          }}
          disabled={popupMode === 'show'}
        >
          <p className="ant-upload-drag-icon">
            <PaperUpload className="mx-auto mt-2" size="large" set="two-tone" />
          </p>
          <p className="ant-upload-text" style={{ fontSize: '16px' }}>
            Choose a file or drag & drop it here or{' '}
            <span className="text-[#DC362E]">browse</span>
          </p>
          <p className="ant-upload-hint" style={{ fontSize: '12px' }}>
            PDF or Image formats, up to 2MB
          </p>
        </Dragger>

        {popupMode === 'show' &&
          currentData.files &&
          currentData.files.length > 0 && (
            <div className="relative mb-4 mt-4">
              <Upload
                fileList={currentData.files.map((file) => ({
                  uid: file.filename,
                  name: file.originalname,
                  status: 'done',
                  url: `${import.meta.env.VITE_API_BASE_URL}/vendors/${id}/ratings/${currentData.submit_rating_id}/${file.filename}/download`,
                }))}
                showUploadList={{
                  showDownloadIcon: true,
                  downloadIcon: <Download size={16} primaryColor="#0553BA" />,
                  showRemoveIcon: false,
                }}
                listType="picture"
                onPreview={(file) => {
                  window.open(file.url, '_blank');
                }}
              />
            </div>
          )}
      </Popup>
      <Footer />
    </div>
  );
}
