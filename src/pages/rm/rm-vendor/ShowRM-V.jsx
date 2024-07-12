import { FloppyDisk } from '@phosphor-icons/react';
import { message } from 'antd';
import api from '../../../api';
import { useEffect, useState, useCallback } from 'react';
import {
  Discount,
  Folder,
  Location,
  Ticket,
  User,
  Wallet,
  Delete,
  Download,
} from 'react-iconly';
import { useNavigate, useParams } from 'react-router-dom';
import PopupDelete from '../../../components/PopUp/PopUpDelete';
import BaseTable from '../../../components/BaseTable';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/NavBar';
import ActionButton from '../../../components/ActionButton';

export default function RMVendorShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState(null);
  const [data, setData] = useState(null);
  const [rateTypes, setRateTypes] = useState([]);
  const [rows, setRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    document.title = 'Resource Manager - VRMS';
  }, []);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/vendors/${id}`)
      .then((response) => {
        if (response.data.code === 200) {
          const { vendor } = response.data.data;
          setData(vendor);
          const initializedRows = vendor.list_rate.map((rate, index) => ({
            ...rate,
            id: index + 1, // Ensure each row has a unique ID
          }));
          setRows(initializedRows);
        } else {
          console.error('Failed to fetch data: ', response.data.message);
        }
      })
      .catch((error) => console.error('Failed to fetch data', error));
  }, [id]);

  // Address Information
  const [country, setCountry] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/countries`)
      .then((response) => setCountry(response.data.data || []))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      api
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/countries/${selectedCountry}/states`
        )
        .then((response) => setProvinces(response.data.data || []))
        .catch((error) => console.error('There was an error!', error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedProvince) {
      api
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/countries/${selectedCountry}/states/${selectedProvince}/cities`
        )
        .then((response) => setCities(response.data.data || []))
        .catch((error) => console.error('There was an error!', error));
    }
  }, [selectedCountry, selectedProvince]);

  useEffect(() => {
    api
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types?limit=1000`
      )
      .then((response) => {
        setRateTypes(response.data.data.rateTypes || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const [resource, setResource] = useState(null);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/vendors/${id}`)
      .then((response) => setResource(response.data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  const handleDeleteFile = async () => {
    if (fileToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/vendors/${data.vendor_id}/attachments/${fileToDelete.filename}`
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
      <td className="py-2 border-b  border-[#E9E9E9]">{attach.originalname}</td>
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
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/vendors/${data.vendor_id}/attachments/${attach.filename}/download`;
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
          {/* Personal Information Section */}
          <section className="w-full mb-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <User size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-1/2 pr-4">
                {/* Personal Input Fields */}
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={data ? data.vendor_name : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Vendor Name"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={data ? data.username : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Username"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Whatsapp
                  </label>
                  <input
                    type="number"
                    value={data ? data.whatsapp : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Whatsapp"
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                {/* More Personal Input Fields */}
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    PIC Name
                  </label>
                  <input
                    type="text"
                    value={data ? data.pic_name : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="PIC Name"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data ? data.email : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Contact Via
                  </label>
                  <input
                    type="text"
                    value={data ? data.contact_via : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Contact Via"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Address Information Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Location size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Address Information
              </h2>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-1/2 pr-4">
                {/* Address Input Fields */}
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Country
                  </label>
                  <input
                    type="text"
                    value={data ? data.country_name : ''}
                    disabled
                    className="w-full rounded-select px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB]"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    City
                  </label>
                  <input
                    type="text"
                    value={data ? data.city_name : ''}
                    disabled
                    className="w-full rounded-select px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB]"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Full Address
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-2 mb-6 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:border-[#065BCC] outline-none"
                    value={data ? data.full_address : ''}
                    disabled
                    placeholder="Write your full address here..."
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                {/* More Address Input Fields */}
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Province
                  </label>
                  <input
                    type="text"
                    value={data ? data.state_name : ''}
                    disabled
                    className="w-full rounded-select px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB]"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    District
                  </label>
                  <input
                    type="text"
                    value={data ? data.district : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="District"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Postal Code
                  </label>
                  <input
                    type="number"
                    value={data ? data.postal_code : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="ZIP/Postal Code"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Bank Information Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Wallet size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Bank Information
              </h2>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-1/2 pr-4">
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Bank
                  </label>
                  <input
                    type="text"
                    value={data ? data.bank_name : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Bank"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Branch Office of Bank
                  </label>
                  <input
                    type="text"
                    value={data ? data.branch_office : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Branch Office of Bank"
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={data ? data.account_holder_name : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Account Holder Name"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Account Number
                  </label>
                  <input
                    type="number"
                    value={data ? data.account_number : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Account Number"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Tax Information Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Ticket size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Tax Information
              </h2>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-1/2 pr-4">
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Resource Status
                  </label>
                  <input
                    type="text"
                    value={data ? data.resource_status : ''}
                    disabled
                    className="w-full rounded-select px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB]"
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    NPWP Number
                  </label>
                  <input
                    type="number"
                    value={data ? data.npwp_number : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="NPWP Number"
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Tax Type
                  </label>
                  <input
                    type="text"
                    value={data ? data.name_tax : ''}
                    disabled
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Tax Type"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Rate Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Discount size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Rate
              </h2>
            </div>
            <div className="w-full">
              <div className="relative">
                <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                  Currency
                </label>
                <input
                  type="text"
                  value={
                    data ? `${data.currency_name} - ${data.currency_code}` : ''
                  }
                  disabled
                  className="w-full rounded-select px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB]"
                />
              </div>
            </div>
            <div className="w-full">
              <div>
                <table className="w-full rounded-t-lg overflow-hidden text-sm border-[#E9E9E9]">
                  <thead>
                    <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
                      <th className="py-3 w-[271px] border-y border-l border-[#E9E9E9] text-center">
                        Type Of Service
                      </th>
                      <th className="py-3 w-[271px] border-y border-[#E9E9E9] text-center">
                        Rate
                      </th>
                      <th className="py-3 w-[271px] border-y border-[#E9E9E9] text-center">
                        Rate Type
                      </th>
                      <th className="py-3 w-[271px] border-y border-r border-[#E9E9E9] text-center">
                        Calculate Unit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="h-[80px] border-[#E9E9E9] border-l border-b">
                          <div className="flex justify-center items-center">
                            <input
                              type="text"
                              className="input border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                              placeholder="Type Of Service"
                              value={row.type_of_service}
                              disabled
                            />
                          </div>
                        </td>
                        <td className="h-[80px] border-[#E9E9E9] border-b">
                          <div className="flex justify-center items-center">
                            <input
                              type="text"
                              className="input border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                              placeholder="Rate"
                              disabled
                              value={parseFloat(row.rate).toLocaleString(
                                'en-US'
                              )}
                              onFocus={(e) => {
                                const value = parseFloat(
                                  e.target.value.replace(/,/g, '')
                                );
                                e.target.value = isNaN(value) ? '' : value;
                              }}
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (!isNaN(value)) {
                                  setRows(
                                    rows.map((r) =>
                                      r.id === row.id
                                        ? { ...r, rate: value }
                                        : r
                                    )
                                  );
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseFloat(
                                  e.target.value.replace(/,/g, '')
                                );
                                e.target.value = isNaN(value)
                                  ? ''
                                  : value.toLocaleString('en-US');
                              }}
                            />
                          </div>
                        </td>

                        <td className="h-[80px] border-[#E9E9E9] border-b">
                          <div className="flex justify-center items-center">
                            <input
                              type="text"
                              className="input border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                              placeholder="Select Rate Type"
                              value={row.rate_type_name}
                              disabled
                            />
                          </div>
                        </td>
                        <td className="h-[80px] border-r border-[#E9E9E9] border-b">
                          <div className="flex justify-center items-center">
                            <input
                              type="text"
                              className="input border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                              placeholder="Select Calculation Unit"
                              value={row.calc_unit}
                              disabled
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* Attachment Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Folder size={24} set="bulk" primaryColor="#FFF" />
              </div>
              <h2 className="ml-3 text-[20px] font-semibold text-gray-900">
                Attachment
              </h2>
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
              onClick={() => navigate('/resource-manager/vendor')}
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
        onDelete={handleDeleteFile}
      />
      <Footer />
    </div>
  );
}
