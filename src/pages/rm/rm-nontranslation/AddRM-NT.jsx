import { Plus } from '@phosphor-icons/react';
import { Select, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { Delete, Discount, Location, Ticket, User, Wallet } from 'react-iconly';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/NavBar';

export default function RMNonTranslationAdd() {
  useEffect(() => {
    document.title = ' Resource Manager - VRMS';
  });

  const navigate = useNavigate();

  // Personal Information
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specializationOn, setSpecializationOn] = useState('');
  const [Tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/master-data/tools/select`)
      .then((response) => {
        setTools(response.data.data.tools || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleChangeTools = (value) => {
    setSelectedTools(value);
    console.log('selected tools: ', value);
  };

  const filterTools = (input, toolsoptions) =>
    (toolsoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };
  const handleNicknameChange = (e) => {
    setNickName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleWhatsappChange = (e) => {
    setWhatsapp(e.target.value);
  };
  const handleSpecializationOnChange = (e) => {
    setSpecializationOn(e.target.value);
  };

  // Resource Status
  const [resource, setResource] = useState('');

  const handleChangeResource = (value) => {
    setResource(value);
  };

  const resourceoptions = [
    { value: 'FreelanceNPWP', label: 'Freelance NPWP' },
    { value: 'FreelanceNonNPWP', label: 'Freelance Non NPWP' },
  ];

  const filterResource = (input, resourceoptions) =>
    (resourceoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // Currency
  const [currency, setCurrency] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');

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

  const handleChangeCurrency = (value) => {
    setSelectedCurrency(value);
    console.log('selected currency: ', value);
  };

  const filterCurrency = (input, currencyoptions) =>
    (currencyoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // Address Information
  const [country, setCountry] = useState([]);

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_BASE_URL}/countries`)
      .then((response) => {
        setCountry(response.data.data || []);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleChangeCountry = (value) => {
    console.log('selected country: ', value);
    setSelectedCountry(value);
  };

  const filterCountry = (input, countryoptions) =>
    (countryoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // Province
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      api
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/countries/${selectedCountry}/states`
        )
        .then((response) => {
          setStates(response.data.data || []);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }
  }, [selectedCountry]);

  const handleChangeState = (value) => {
    console.log('selected State: ', value);
    setSelectedState(value);
  };

  const filterState = (input, stateoptions) =>
    (stateoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // City
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    if (selectedState) {
      api
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/countries/${selectedCountry}/states/${selectedState}/cities`
        )
        .then((response) => {
          setCities(response.data.data || []);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }
  }, [selectedCountry, selectedState]);

  const handleChangeCity = (value) => {
    setSelectedCity(value);
  };

  const filterCity = (input, cityoptions) =>
    (cityoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const [postalCode, setPostalCode] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };
  const handleFullAddressChange = (e) => {
    setFullAddress(e.target.value);
  };

  // Bank Information
  const [bank, setBank] = useState('');
  const [branchOffice, setBranchOfffice] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleBankChange = (e) => {
    setBank(e.target.value);
  };
  const handleBranchOfficeChange = (e) => {
    setBranchOfffice(e.target.value);
  };
  const handleAccountHolderNameChange = (e) => {
    setAccountHolderName(e.target.value);
  };
  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  // Tax Information
  const [taxType, setTaxType] = useState('');
  const [npwpNumber, setNpwpNumber] = useState('');

  const handleTaxTypeChange = (e) => {
    setTaxType(e.target.value);
  };
  const handleNpwpNumberChange = (e) => {
    setNpwpNumber(e.target.value);
  };

  // Rate Table State
  const [rows, setRows] = useState([{ id: 1 }]);
  const [rateTypes, setRateTypes] = useState([]);

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

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChangeRateType = (value, rowId) => {
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, rateType: value } : row))
    );
  };

  const filterRateType = (input, ratetypeoptions) =>
    (ratetypeoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // const [setCalUnit] = useState('');
  // const handleChangeCalUnit = (value) => {
  //   setCalUnit(value);
  // };

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

  const filterCalUnit = (input, calunitoptions) =>
    (calunitoptions?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const [formSubmitted, setFormSubmitted] = useState(false);

  const isFieldEmpty = (field) => {
    if (typeof field === 'string') {
      return !field.trim();
    }
    if (Array.isArray(field)) {
      return field.length === 0;
    }
    return field === null || field === undefined;
  };

  const handleSubmitResource = async () => {
    setFormSubmitted(true);
    if (
      isFieldEmpty(fullName) ||
      isFieldEmpty(nickName) ||
      isFieldEmpty(whatsapp) ||
      isFieldEmpty(email) ||
      isFieldEmpty(specializationOn) ||
      selectedTools.length === 0 ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity ||
      isFieldEmpty(district) ||
      isFieldEmpty(postalCode)
    ) {
      message.error('Please fill in all required fields');
      return;
    }

    // Proceed with form submission if validation passes
    const data = {
      // personal information
      full_name: fullName,
      nickname: nickName,
      email,
      whatsapp,
      tools: selectedTools,
      specialization_on: specializationOn,
      // address information
      country_id: parseInt(selectedCountry),
      state_id: parseInt(selectedState),
      city_id: parseInt(selectedCity),
      district,
      postal_code: postalCode,
      full_address: fullAddress,
      // bank information
      bank_name: bank,
      branch_office: branchOffice,
      account_holder_name: accountHolderName,
      account_number: accountNumber,
      // tax information
      resource_status: resource,
      name_tax: taxType,
      npwp_number: npwpNumber,
      // rate
      currency_id: parseInt(selectedCurrency),
      // list of rates
      list_rate: rows.map((row) => ({
        rate: parseFloat(row.rate),
        type_of_service: row.type_of_service,
        rate_type_id: parseInt(row.rateType),
        calc_unit: row.calc_unit,
      })),
      // attachment - omitted for brevity
    };

    console.log('Payload to be sent:', data);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/freelances/non-translation`,
        data
      );
      console.log('Data submitted successfully:', response.data);
      console.log('Response data:', response.data);
      const freelanceId = response.data.data.freelance_id;
      navigate(`/resource-manager/non-translation/${freelanceId}/attachments`);
    } catch (error) {
      console.error(
        'There was an error!',
        error.response ? error.response.data : error.message
      );
    }
  };

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
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(fullName)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="Full Name"
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
                  {formSubmitted && isFieldEmpty(fullName) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Whatsapp
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(whatsapp)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="Whatsapp"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                  />
                  {formSubmitted && isFieldEmpty(whatsapp) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="Tools" className="text-[14px] text-[#9A9A9A]">
                    Tools
                  </label>
                  <Space
                    style={{
                      width: '100%',
                      marginTop: '1px',
                    }}
                    direction="vertical"
                  >
                    <Select
                      className={`rounded-select ${
                        formSubmitted && selectedTools.length === 0
                          ? 'border-[#DC362E] focus:border-[#DC362E]'
                          : ''
                      }`}
                      mode="multiple"
                      allowClear
                      style={{
                        width: '100%',
                        height: '55px',
                      }}
                      placeholder="You can select 1 or more tools"
                      maxTagCount={3}
                      maxTagPlaceholder={(omittedValues) =>
                        `${omittedValues.length} more`
                      }
                      onChange={(value) => handleChangeTools(value)}
                      filterOption={filterTools}
                      options={Tools.map((Tools) => ({
                        value: Tools.tool_name,
                        label: Tools.tool_name,
                      }))}
                    />
                  </Space>
                  {formSubmitted && selectedTools.length === 0 && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
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
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(nickName)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="Nickname"
                    value={nickName}
                    onChange={handleNicknameChange}
                  />
                  {formSubmitted && isFieldEmpty(nickName) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(email)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {formSubmitted && isFieldEmpty(email) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Specialization On
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(specializationOn)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="Specialization On"
                    value={specializationOn}
                    onChange={handleSpecializationOnChange}
                  />
                  {formSubmitted && isFieldEmpty(specializationOn) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
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
                    className={`rounded-select ${
                      formSubmitted && !selectedCountry
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : ''
                    }`}
                    showSearch
                    placeholder="Select Country"
                    optionFilterProp="children"
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    onChange={(value) => handleChangeCountry(value)}
                    filterOption={filterCountry}
                    options={country.map((country) => ({
                      value: country.id,
                      label: country.name,
                    }))}
                  />
                  {formSubmitted && !selectedCountry && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    City
                  </label>
                  <Select
                    className={`rounded-select ${
                      formSubmitted && !selectedCity
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : ''
                    }`}
                    showSearch
                    placeholder="Select City"
                    optionFilterProp="children"
                    onChange={handleChangeCity}
                    filterOption={filterCity}
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    options={cities.map((city) => ({
                      value: city.id,
                      label: city.name,
                    }))}
                  />
                  {formSubmitted && !selectedCity && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Full Address
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-2 mb-6 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:border-[#065BCC] outline-none"
                    placeholder="Write your full address here..."
                    value={fullAddress}
                    onChange={handleFullAddressChange}
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
                    className={`rounded-select ${
                      formSubmitted && !selectedState
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : ''
                    }`}
                    showSearch
                    placeholder="Select Province"
                    optionFilterProp="children"
                    onChange={handleChangeState}
                    filterOption={filterState}
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    options={states.map((state) => ({
                      value: state.id,
                      label: state.name,
                    }))}
                  />
                  {formSubmitted && !selectedState && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    District
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(district)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="District"
                    value={district}
                    onChange={handleDistrictChange}
                  />
                  {formSubmitted && isFieldEmpty(district) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Postal Code
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border focus:outline-none ${
                      formSubmitted && isFieldEmpty(postalCode)
                        ? 'border-[#DC362E] focus:border-[#DC362E]'
                        : 'border-[#BBBBBB] focus:border-[#065BCC]'
                    }`}
                    placeholder="ZIP/Postal Code"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                  />
                  {formSubmitted && isFieldEmpty(postalCode) && (
                    <p className="text-[#DC362E] -mt-6 text-[14px]">
                      This cannot be empty
                    </p>
                  )}
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
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Bank"
                    value={bank}
                    onChange={handleBankChange}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Branch Office of Bank
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Branch Office of Bank"
                    value={branchOffice}
                    onChange={handleBranchOfficeChange}
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
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Account Holder Name"
                    value={accountHolderName}
                    onChange={handleAccountHolderNameChange}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    Account Number
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Tax Information Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Discount size={24} set="bulk" primaryColor="#FFF" />
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
                    onChange={handleChangeResource}
                    filterOption={filterResource}
                    style={{
                      width: '100%',
                      height: '55px',
                      marginBottom: '24px',
                    }}
                    options={resourceoptions}
                  />
                </div>
                <div className="relative">
                  <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                    NPWP Number
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="NPWP Number"
                    value={npwpNumber}
                    onChange={handleNpwpNumberChange}
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
                    className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                    placeholder="Tax Type"
                    value={taxType}
                    onChange={handleTaxTypeChange}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Rate Section */}
          <section className="w-full mt-8">
            <div className="w-full flex items-center mb-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#DC362E]">
                <Ticket size={24} set="bulk" primaryColor="#FFF" />
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
                  onChange={(value) => handleChangeCurrency(value)}
                  filterOption={filterCurrency}
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
                    <th className="py-3 w-[271px]  border-y border-l border-[#E9E9E9] text-center">
                      Type Of Service
                    </th>
                    <th className="py-3 w-[271px] border-y border-[#E9E9E9] text-center">
                      Rate
                    </th>
                    <th className="py-3 w-[271px] border-y border-[#E9E9E9] text-center">
                      Rate Type
                    </th>
                    <th className="py-3 w-[271px] border-y border-[#E9E9E9] text-center">
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
                                    ? { ...r, type_of_service: e.target.value }
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
                            onChange={(value) =>
                              handleChangeRateType(value, row.id)
                            }
                            filterOption={filterRateType}
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
                            onChange={(value) =>
                              setRows(
                                rows.map((r) =>
                                  r.id === row.id
                                    ? { ...r, calc_unit: value }
                                    : r
                                )
                              )
                            }
                            filterOption={filterCalUnit}
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
          <div className="w-full flex justify-end mt-14">
            <Button
              className="bg-[#DC362E] border w-[131px] h-[48px] hover:bg-[#DC362E]"
              onClick={handleSubmitResource}
            >
              <span className="text-white">Next</span>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
