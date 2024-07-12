import { FloppyDisk, Plus } from '@phosphor-icons/react';
import { Select, Upload, message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  Delete,
  Discount,
  Download,
  Folder,
  Location,
  PaperUpload,
  Ticket,
  User,
  Wallet,
} from 'react-iconly';
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

export default function RMTranslationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [rateTypes, setRateTypes] = useState([]);
  const [rows, setRows] = useState([]);
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
        url: `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${id}/attachments`,
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

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${id}`)
      .then((response) => {
        if (response.data.code === 200) {
          const { freelance } = response.data.data;
          setData(freelance);
          setSelectedTools(freelance.tools);
          const initializedRows = freelance.list_rate.map((rate, index) => ({
            ...rate,
            id: index + 1,
          }));
          setRows(initializedRows);
          setLanguageFrom(freelance.language_from_id);
          setLanguageTo(freelance.language_to_id);
        } else {
          console.error('Failed to fetch data: ', response.data.message);
        }
      })
      .catch((error) => console.error('Failed to fetch data', error));
  }, [id]);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/master-data/tools/select`)
      .then((response) => {
        const toolOptions = response.data.data.tools.map((tool) => ({
          label: tool.tool_name,
          value: tool.tool_name,
        }));
        setTools(toolOptions);
      })
      .catch((error) =>
        console.error('There was an error accessing the tools data:', error)
      );
  }, []);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/master-data/rate-types/select`)
      .then((response) => {
        setRateTypes(response.data.data.rateTypes || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/languages`)
      .then((response) => {
        setLanguages(response.data.data || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  // Data Information
  const [country, setCountry] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currency, setCurrency] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [languageFrom, setLanguageFrom] = useState(null);
  const [languageTo, setLanguageTo] = useState(null);
  const [draggerVisible, setDraggerVisible] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/currencies`)
      .then((response) => {
        setCurrency(response.data.data || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

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

  const [resourceStatusOptions, setResourceStatusOptions] = useState([
    { value: 'FreelanceNPWP', label: 'Freelance NPWP' },
    { value: 'FreelanceNonNPWP', label: 'Freelance Non NPWP' },
  ]);

  useEffect(() => {
    if (data) {
      setSelectedCountry(data.country_id);
      setSelectedProvince(data.state_id);
      setSelectedCity(data.city_id);
      setSelectedCurrency(data.currency_id);
    }
  }, [data]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        type_of_service: '',
        rate: '',
        rate_type_id: '',
        calc_unit: '',
      },
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calunitoptions = [
    { value: 'SourceWord', label: 'Source Word' },
    { value: 'SourceCharacter', label: 'Source Character' },
    { value: 'Page', label: 'Page' },
    { value: 'Hour', label: 'Hour' },
    { value: 'Image', label: 'Image' },
    { value: 'Minute', label: 'Minute' },
    { value: 'Day', label: 'Day' },
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
    { value: 'Package', label: 'Package' },
    { value: 'Lifetime', label: 'Lifetime' },
  ];

  const handleSave = async () => {
    if (
      !selectedCountry ||
      !selectedProvince ||
      !selectedCity ||
      !data.full_name ||
      !data.username ||
      !data.whatsapp ||
      !selectedTools ||
      !data.nickname ||
      !data.email ||
      !data.specialization_on ||
      !data.district ||
      !data.postal_code
    ) {
      console.error('The data is not filled');
      message.error('Please fill in all required fields');
      return;
    }

    const payload = {
      full_name: data.full_name,
      username: data.username,
      whatsapp: data.whatsapp,
      tools: selectedTools,
      nickname: data.nickname,
      email: data.email,
      specialization_on: data.specialization_on,
      language_from_id: parseInt(languageFrom),
      language_to_id: parseInt(languageTo),
      country_id: selectedCountry,
      state_id: selectedProvince,
      city_id: selectedCity,
      district: data.district,
      postal_code: data.postal_code,
      full_address: data.full_address,
      bank_name: data.bank_name,
      branch_office: data.branch_office,
      account_holder_name: data.account_holder_name,
      account_number: data.account_number,
      resource_status: data.resource_status,
      npwp_number: data.npwp_number,
      name_tax: data.name_tax,
      currency_id: selectedCurrency,
      list_rate: rows.map((row) => ({
        rate: parseFloat(row.rate),
        type_of_service: row.type_of_service,
        rate_type_id: parseInt(row.rate_type_id),
        calc_unit: row.calc_unit,
      })),
    };

    try {
      const response = await api.patch(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${id}`,
        payload
      );
      message.success('Resource Updated Successfully!');
      console.log('Data updated successfully:', response.data);
      navigate('/resource-manager/translation');
    } catch (error) {
      console.error(
        'There was an error!',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async () => {
    if (fileToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${data.freelance_id}/attachments/${fileToDelete.filename}`
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
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/freelances/translation/${data.freelance_id}/attachments/${attach.filename}/download`;
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Full Name"
                    value={data ? data.full_name : ''}
                    onChange={(e) =>
                      setData({ ...data, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={data ? data.username : ''}
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
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
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Whatsapp"
                    value={data ? data.whatsapp : ''}
                    onChange={(e) =>
                      setData({ ...data, whatsapp: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <label htmlFor="tools" className="text-[14px] text-[#9A9A9A]">
                    Tools
                  </label>
                  <Select
                    mode="multiple"
                    className="rounded-select"
                    allowClear
                    style={{ width: '100%', height: '55px' }}
                    placeholder="Select tools"
                    value={selectedTools}
                    onChange={setSelectedTools}
                    options={tools}
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                {/* More Personal Input Fields */}
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Nickname
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Nickname"
                    value={data ? data.nickname : ''}
                    onChange={(e) =>
                      setData({ ...data, nickname: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Email"
                    value={data ? data.email : ''}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Specialization On
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Specialization On"
                    value={data ? data.specialization_on : ''}
                    onChange={(e) =>
                      setData({ ...data, specialization_on: e.target.value })
                    }
                  />
                </div>
                {/* Language Pairs Dropdown */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Language From */}
                  <div className="relative">
                    <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                      Language From
                    </label>
                    <Select
                      className="rounded-select"
                      showSearch
                      placeholder="Select Language From"
                      optionFilterProp="children"
                      style={{
                        width: '100%',
                        height: '55px',
                      }}
                      value={languageFrom}
                      onChange={setLanguageFrom}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      options={languages.map((language) => ({
                        value: language.id,
                        label: `${language.name} - ${language.code}`,
                      }))}
                    />
                  </div>
                  <div className="relative">
                    <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                      Language To
                    </label>
                    <Select
                      className="rounded-select"
                      showSearch
                      placeholder="Select Language To"
                      optionFilterProp="children"
                      style={{
                        width: '100%',
                        height: '55px',
                      }}
                      value={languageTo}
                      onChange={setLanguageTo}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      options={languages.map((language) => ({
                        value: language.id,
                        label: `${language.name} - ${language.code}`,
                      }))}
                    />
                  </div>
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
                  <Select
                    className="rounded-select"
                    showSearch
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    placeholder="Select Country"
                    optionFilterProp="children"
                    value={selectedCountry}
                    onChange={(value) => {
                      setSelectedCountry(value);
                      setSelectedProvince(null); // Reset province when country changes
                      setSelectedCity(null); // Reset city when province changes
                      setData({
                        ...data,
                        country_id: value,
                        state_id: null,
                        city_id: null,
                      });
                    }}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={country.map((country) => ({
                      value: country.id,
                      label: country.name,
                    }))}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    City
                  </label>
                  <Select
                    className="rounded-select"
                    showSearch
                    placeholder="Select City"
                    optionFilterProp="children"
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    value={selectedCity}
                    onChange={(value) => {
                      setSelectedCity(value);
                      setData({ ...data, city_id: value });
                    }}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={cities.map((city) => ({
                      value: city.id,
                      label: city.name,
                    }))}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Full Address
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-2 mb-6 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:border-[#065BCC] outline-none"
                    value={data ? data.full_address : ''}
                    onChange={(e) =>
                      setData({ ...data, full_address: e.target.value })
                    }
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
                  <Select
                    className="rounded-select"
                    showSearch
                    placeholder="Select Province"
                    optionFilterProp="children"
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    value={selectedProvince}
                    onChange={(value) => {
                      setSelectedProvince(value);
                      setSelectedCity(null); // Reset city when province changes
                      setData({ ...data, state_id: value, city_id: null });
                    }}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={provinces.map((province) => ({
                      value: province.id,
                      label: province.name,
                    }))}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    District
                  </label>
                  <input
                    type="text"
                    value={data ? data.district : ''}
                    onChange={(e) =>
                      setData({ ...data, district: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, postal_code: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, bank_name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, branch_office: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({
                        ...data,
                        account_holder_name: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, account_number: e.target.value })
                    }
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
                  <Select
                    className="rounded-select"
                    showSearch
                    placeholder="Resource Status"
                    optionFilterProp="children"
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    value={data ? data.resource_status : null}
                    onChange={(value) =>
                      setData({ ...data, resource_status: value })
                    }
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={resourceStatusOptions}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    NPWP Number
                  </label>
                  <input
                    type="number"
                    value={data ? data.npwp_number : ''}
                    onChange={(e) =>
                      setData({ ...data, npwp_number: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, name_tax: e.target.value })
                    }
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
                <Select
                  className="rounded-select"
                  showSearch
                  placeholder="Select Currency"
                  optionFilterProp="children"
                  style={{
                    width: '100%',
                    height: '55px',
                    marginBottom: '24px',
                  }}
                  value={selectedCurrency}
                  onChange={(value) => setSelectedCurrency(value)}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={currency.map((currency) => ({
                    value: currency.id,
                    label: `${currency.name} - ${currency.code}`,
                  }))}
                />
              </div>
            </div>
            <div className="w-full">
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
                    <th className="py-3 w-[271px] border-y  border-[#E9E9E9] text-center">
                      Calculate Unit
                    </th>
                    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9] text-center">
                      Action
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
                            value={row.type_of_service || ''}
                            onChange={(e) =>
                              setRows(
                                rows.map((r) =>
                                  r.id === row.id
                                    ? {
                                        ...r,
                                        type_of_service: e.target.value,
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </div>
                      </td>
                      <td className="h-[80px] border-[#E9E9E9] border-b">
                        <div className="flex justify-center items-center">
                          <input
                            type="text"
                            className="input border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                            placeholder="Rate"
                            value={
                              isNaN(parseFloat(row.rate))
                                ? ''
                                : parseFloat(row.rate).toLocaleString('en-US')
                            }
                            onFocus={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              e.target.value = isNaN(value) ? '' : value;
                            }}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              setRows(
                                rows.map((r) =>
                                  r.id === row.id ? { ...r, rate: value } : r
                                )
                              );
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
                          <Select
                            className="rate-select w-[250px]"
                            showSearch
                            placeholder="Select Rate Type"
                            optionFilterProp="children"
                            value={row.rate_type_id || ''}
                            onChange={(value) =>
                              setRows(
                                rows.map((r) =>
                                  r.id === row.id
                                    ? { ...r, rate_type_id: value }
                                    : r
                                )
                              )
                            }
                            filterOption={(input, option) =>
                              option.label
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={rateTypes.map((rateType) => ({
                              value: rateType.rate_type_id,
                              label: rateType.rate_type_name,
                            }))}
                          />
                        </div>
                      </td>
                      <td className="h-[80px] border-[#E9E9E9] border-b">
                        <div className="flex justify-center items-center">
                          <Select
                            className="rate-select w-[250px]"
                            showSearch
                            placeholder="Select Calculation Unit"
                            optionFilterProp="children"
                            value={row.calc_unit || ''}
                            onChange={(value) =>
                              setRows(
                                rows.map((r) =>
                                  r.id === row.id
                                    ? { ...r, calc_unit: value }
                                    : r
                                )
                              )
                            }
                            filterOption={(input, option) =>
                              option.label
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={calunitoptions}
                          />
                        </div>
                      </td>
                      <td className="h-[80px] border-[#E9E9E9] border-b border-r">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteRow(row.id)}>
                            <Delete
                              set="bulk"
                              size={18}
                              primaryColor="#DC362E"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-4 pl-4 mb-6 h-[73px] bg-[#F9F9F9] rounded-b-lg border border-[#E9E9E9]">
                <Button
                  className="bg-[#DC362E] hover:bg-[#DC362E]"
                  onClick={addRow}
                >
                  <Plus className="w-3 h-3 text-white" weight="bold" />
                  <span className="text-white text-[12px]">Add Row</span>
                </Button>
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
                apiUrl={`freelances/translation/${id}/attachments`}
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
