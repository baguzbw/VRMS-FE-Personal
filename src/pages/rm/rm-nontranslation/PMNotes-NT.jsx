import { Plus } from '@phosphor-icons/react';
import { Select, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Edit, PaperPlus } from 'react-iconly';
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

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[50px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[119px] border-y border-[#E9E9E9]">Created At</th>
    <th className="py-3 w-[281px] border-y border-[#E9E9E9]">Note</th>
    <th className="py-3 pl-5 w-[320px] border-y border-[#E9E9E9]">Reply</th>
    <th className="py-3 pl-8 w-[200px] border-y border-[#E9E9E9]">
      Submitted By
    </th>
    <th className="py-3 w-[160px] border-y border-[#E9E9E9]">Status</th>
    <th className="py-3 w-[65px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function PMNotesNonTranslation() {
  const { id } = useParams();
  useEffect(() => {
    document.title = ' Freelance / Non Translation - VRMS';
  });

  const [openActionId, setOpenActionId] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [tableKey, setTableKey] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reply, setReply] = useState('');
  const maxCharacters = 200;
  const [currentData, setCurrentData] = useState({
    pm_notes_id: null,
    note: '',
    reply: '',
    status_approval: '',
  });

  const isFieldEmpty = (field) => {
    return !field || field.trim() === '';
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  //Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add'); // 'add' or 'edit'

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setShowPopup(true);
    setFormSubmitted(false);
    setCurrentData({
      pm_notes_id: null,
      note: '',
      reply: '',
      status_approval: '',
    });
  };

  const handleShowEditPopup = (pmnote) => {
    setPopupMode('edit');
    setShowPopup(true);
    setFormSubmitted(false);
    setCurrentData(pmnote);
    setReply(pmnote.reply || '');
    setApproval(pmnote.status_approval || '');
  };

  const [resource, setResource] = useState(null);

  useEffect(() => {
    api
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/non-translation/${id}`
      )
      .then((response) => setResource(response.data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  const handleSaveNotes = async () => {
    setFormSubmitted(true);

    if (
      isFieldEmpty(currentData.note) ||
      (popupMode === 'edit' && isFieldEmpty(reply))
    ) {
      message.error('Please fill in all required fields');
      return;
    }

    if (popupMode === 'add') {
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/non-translation/${id}/pm-notes`,
        {
          note: currentData.note,
        }
      );
      message.success('Note Added Successfully!');
      console.log('Note added successfully:', response.data);
    } else if (popupMode === 'edit') {
      const response = await api.patch(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/non-translation/${id}/pm-notes/${currentData.pm_notes_id}`,
        {
          reply: reply,
          status_approval: currentData.status_approval,
        }
      );
      message.success('Note Updated Successfully!');
      console.log('Note updated successfully:', response.data);
    }
    setShowPopup(false);
    setFormSubmitted(false);
    refreshTable();
  };

  

  const toggleActionDropdown = (pm_notes_id) => {
    setOpenActionId(openActionId === pm_notes_id ? null : pm_notes_id);
  };

  //Resource Status
  const [approval, setApproval] = useState('');

  const handleChangeApproval = (value) => {
    setApproval(value);
    setCurrentData({ ...currentData, status_approval: value });
  };

  const approvaloptions = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const filterApproval = (input, approvaloptions) =>
    (approvaloptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const renderRow = (pmnote, index, startIndex, showActions) => {
    let statusStyle;
    switch (pmnote.status_approval) {
      case 'Approved':
        statusStyle = { backgroundColor: '#B6EBCF', color: '#0F8847' };
        break;
      case 'Pending':
        statusStyle = { backgroundColor: '#B2CCEF', color: '#044191' };
        break;
      case 'Rejected':
        statusStyle = { backgroundColor: '#FFC0BC', color: '#B5261B' };
        break;
      default:
        statusStyle = { backgroundColor: 'inherit', color: 'inherit' };
    }

    return (
      <tr
        key={pmnote.pm_notes_id}
        className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
      >
        <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
          {startIndex + index + 1}
        </td>
        <td className="py-2 border-b border-[#E9E9E9]">{pmnote.created_at}</td>
        <td className="py-2 border-b border-[#E9E9E9]">{pmnote.note}</td>
        <td className="py-2 border-b pl-5 border-[#E9E9E9]">{pmnote.reply}</td>
        <td className="py-2 border-b pl-8 border-[#E9E9E9]">
          {pmnote.user_note}
        </td>
        <td className="py-2 border-b border-[#E9E9E9]">
          <span className="px-3 py-1 rounded-lg" style={{ ...statusStyle }}>
            {pmnote.status_approval}
          </span>
        </td>

        {showActions && (
          <td className="py-2 border-b border-r border-[#E9E9E9]">
            <ActionButton
              isOpen={openActionId === pmnote.pm_notes_id}
              toggle={() => toggleActionDropdown(pmnote.pm_notes_id)}
              label="ACTION"
            >
              <div className="mx-[10px]">
                <button
                  className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                  onClick={() => handleShowEditPopup(pmnote)}
                >
                  <Edit set="two-tone" size={24} className="mx-[10px]" />
                  <span className="text-[14px]">Approval</span>
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
            <span className="text-white">Add PM Notes</span>
          </Button>
        </div>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl={`freelances/non-translation/${id}/pm-notes`}
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>
      <Popup
        show={showPopup}
        onSave={handleSaveNotes}
        onClose={() => setShowPopup(false)}
        title={popupMode === 'add' ? 'Add Note' : 'Edit Note'}
        icon={popupMode === 'edit' ? Edit : PaperPlus}
        className="w-[550px]"
      >
        <div className="relative">
          <label className="block mb-1 text-[14px] text-[#9A9A9A]">Note</label>
          <textarea
            className={`w-full h-32 px-4 py-2 rounded-[15px] text-[14px] border focus:outline-none ${
              formSubmitted && isFieldEmpty(currentData.note)
                ? 'border-[#DC362E] focus:border-[#DC362E]'
                : 'border-[#BBBBBB] focus:border-[#065BCC]'
            }`}
            placeholder="Write Your Note Here..."
            maxLength={maxCharacters}
            value={currentData.note || ''}
            onChange={(e) =>
              setCurrentData({
                ...currentData,
                note: e.target.value,
              })
            }
            disabled={popupMode === 'edit'}
          />
          {formSubmitted && isFieldEmpty(currentData.note) && (
            <p className="text-[#DC362E] mb-2 text-[14px]">
              This cannot be empty
            </p>
          )}
          <p className="text-[12px] mb-4 text-[#9A9A9A]">
            Maximum 200 characters
          </p>
        </div>
        {popupMode === 'edit' && (
          <>
            <div className="relative">
              <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                Reply
              </label>
              <textarea
                className={`w-full h-32 px-4 py-2 rounded-[15px] text-[14px] border focus:outline-none ${
                  formSubmitted && isFieldEmpty(reply)
                    ? 'border-[#DC362E] focus:border-[#DC362E]'
                    : 'border-[#BBBBBB] focus:border-[#065BCC]'
                }`}
                placeholder="Write Your Reply ere..."
                maxLength={maxCharacters}
                value={reply}
                onChange={handleReplyChange}
              />
              {formSubmitted && isFieldEmpty(reply) && (
                <p className="text-[#DC362E] mb-2 text-[14px]">
                  This cannot be empty
                </p>
              )}
              <p className="text-[12px] mb-4 text-[#9A9A9A]">
                Maximum 200 characters
              </p>
            </div>
            <div className="relative">
              <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                Approval Status
              </label>
              <Select
                className="rounded-select"
                showSearch
                placeholder="Approval Status"
                optionFilterProp="children"
                onChange={handleChangeApproval}
                filterOption={filterApproval}
                style={{
                  width: '100%',
                  height: '55px',
                  marginBottom: '24px',
                }}
                options={approvaloptions}
                value={currentData.status_approval}
              />
            </div>
          </>
        )}
      </Popup>
      <Footer />
    </div>
  );
}
