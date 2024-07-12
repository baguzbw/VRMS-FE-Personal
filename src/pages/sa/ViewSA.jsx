import { Plus } from '@phosphor-icons/react';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { Delete, Edit } from 'react-iconly';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ActionButton from '../../components/ActionButton';
import BaseTable from '../../components/BaseTable';
import Button from '../../components/Button';
import DropdownButton from '../../components/DropdownButton';
import Footer from '../../components/Footer';
import Navbar from '../../components/NavBar';
import PopupDelete from '../../components/PopUp/PopUpDelete';
import Search from '../../components/Search';

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 border-y w-[66px] border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[336px] border-y border-[#E9E9E9]">Full Name</th>
    <th className="py-3 w-[343px] border-y border-[#E9E9E9]">Email</th>
    <th className="py-3 w-[291px] border-y border-[#E9E9E9]">Role</th>
    <th className="py-3 w-[72px] border-y border-r border-[#E9E9E9] ">
      Action
    </th>
  </tr>
);

export default function SystemAdmin() {
  useEffect(() => {
    document.title = ' System Administrator - VRMS';
  });

  const [openActionId, setOpenActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State untuk menampilkan pop-up konfirmasi
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('newest');
  const [tableKey, setTableKey] = useState(0);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigateToAddData = () => {
    navigate('/system-administrator/add');
  };

  const toggleActionDropdown = (id) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/system-administrator/${userToDelete.user_id}`
        );
        setShowDeleteConfirmation(false);
        setUserToDelete(null);
        refreshTable();
        message.success('User Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const fetchUserDetails = (id) => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/system-administrator/${id}`)
      .then((response) => {
        if (response.data.code === 200) { 
          navigate(`/system-administrator/edit/${id}`, {
            state: { user: response.data.data.getUser },
          });
        } else {
          console.error('Error fetching details: ', response.data.message);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the user details!', error);
      });
  };

  const refreshTable = () => {
    setTableKey((prevKey) => prevKey + 1);
  };

  const renderRow = (user, index, startIndex) => (
    <tr
      key={user.user_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">{user.full_name}</td>
      <td className="py-2 border-b border-[#E9E9E9]">{user.email}</td>
      <td className="py-2 border-b border-[#E9E9E9]">{user.role}</td>
      <td className="py-2 border-b border-r border-[#E9E9E9]">
        <ActionButton
          isOpen={openActionId === user.user_id}
          toggle={() => toggleActionDropdown(user.user_id)}
          label="ACTION"
        >
          <div className="mx-[10px]">
            <button className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]" onClick={() => fetchUserDetails(user.user_id)}>
              <Edit set="two-tone" size={24} className="mx-[10px]"/>
              <span className="text-[14px]">Edit</span>
            </button>
            {/* Menampilkan pop-up konfirmasi saat tombol Delete diklik */}
            <button
              className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
              onClick={() => {
                setUserToDelete(user);
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
          onClick={navigateToAddData}
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
          apiUrl="system-administrator"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
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
