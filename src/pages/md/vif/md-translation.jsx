import { FileCsv, FileXls, Plus } from '@phosphor-icons/react';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Delete, Download, Edit, PaperPlus } from 'react-iconly';
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

const renderHeader = () => (
  <tr className="bg-[#F9F9F9] text-[#9A9A9A] text-left h-[57px]">
    <th className="py-3 w-[59px] border-y border-l border-[#E9E9E9] text-center">
      No.
    </th>
    <th className="py-3 w-[985px] border-y border-[#E9E9E9]">Template Name</th>
    <th className="py-3 w-[68px] border-y border-r border-[#E9E9E9]">Action</th>
  </tr>
);

export default function MDTranslation() {
  const [openActionId, setOpenActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState('add'); // 'add' or 'edit'
  const [currentData, setCurrentData] = useState(null);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [duplicateTemplateNameError, setDuplicateTemplateNameError] =
    useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredDownload, setHoveredDownload] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    document.title = ' Variable Input Form / Translation - VRMS';
  }, []);

  const toggleActionDropdown = (id) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const defaultVariables = [
    'Full Name',
    'Nickname',
    'Whatsapp',
    'Specialization On',
    'Email',
    'Language From',
    'Language To',
    'Tools',
    'Country',
    'Province',
    'City',
    'District',
    'Postal Code',
  ];

  const handleShowEditPopup = (template) => {
    setPopupMode('edit');
    setCurrentData(template);
    // Menggabungkan variabel dari template yang ingin diedit dan variabel bawaan
    const selectedVars = [...template.variable, ...defaultVariables];
    // Menghapus duplikat dari variabel yang dipilih
    const uniqueSelectedVars = Array.from(new Set(selectedVars));
    setSelectedVariables(uniqueSelectedVars);
    setShowPopup(true);
  };

  const handleShowAddPopup = () => {
    setPopupMode('add');
    setCurrentData({ template_name: '' });
    setSelectedVariables([...defaultVariables]);
    setDuplicateTemplateNameError(null);
    setShowPopup(true);
  };

  const resetFormState = () => {
    setFormSubmitted(false);
    setDuplicateTemplateNameError(null);
    setCurrentData({
      template_id: null,
      template_name: '',
    });
  };

  const handleCancelPopup = () => {
    setCurrentData(null);
    setSelectedVariables([]);
    setShowPopup(false);
  };

  const handleCheckboxChange = (e, variable) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Check if the variable already exists in the list before adding it
      if (!selectedVariables.includes(variable)) {
        setSelectedVariables([...selectedVariables, variable]);
      }
    } else {
      setSelectedVariables(
        selectedVariables.filter((item) => item !== variable)
      );
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // Check if the template name is already taken
      const existingTemplatesResponse = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation`
      );
      const existingTemplatesData = existingTemplatesResponse.data;
      const existingTemplates = Array.isArray(existingTemplatesData)
        ? existingTemplatesData
        : [];
      const isDuplicateName = existingTemplates.some(
        (template) => template.template_name === currentData.template_name
      );

      if (isDuplicateName && popupMode === 'add') {
        setDuplicateTemplateNameError('Template name is already used');
        return;
      }

      if (isDuplicateName && popupMode === 'edit') {
        setDuplicateTemplateNameError('Template name is already used');
        return;
      }

      if (!currentData.template_name.trim()) {
        setFormSubmitted(true);
        return;
      }

      if (popupMode === 'add') {
        const response = await api.post(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation`,
          {
            template_name: currentData.template_name,
            variable: selectedVariables,
          }
        );
        message.success('Template Added Successfully!');
        console.log('Template added successfully:', response.data);
      } else if (popupMode === 'edit' && currentData.template_id) {
        const response = await api.patch(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation/${currentData.template_id}`,
          {
            template_name: currentData.template_name,
            variable: selectedVariables,
          }
        );
        message.success('Template Edited Successfully!');
        console.log('Template updated successfully:', response.data);
      }
      setShowPopup(false);
      resetFormState();
      refreshTable();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setDuplicateTemplateNameError('Template name is already used');
      } else {
        console.error('Error saving template:', error);
      }
    }
  };

  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        await api.delete(
          `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation/${templateToDelete.template_id}`
        );
        setShowDeleteConfirmation(false);
        setTemplateToDelete(null);
        refreshTable();
        message.success('Template Deleted Successfully!');
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const groupedVariables = () => {
    const categories = {
      'Personal Information': [
        'Full Name',
        'Nickname',
        'Whatsapp',
        'Specialization On',
        'Email',
        'Language From',
        'Language To',
        'Tools',
      ],
      'Address Information': [
        'Country',
        'Province',
        'City',
        'District',
        'Postal Code',
        'Full Address',
      ],
      'Rate Information': [
        'Currency',
        'Type of Service',
        'Rate',
        'Rate Type',
        'Calculation Unit',
      ],
      'Bank Information': [
        'Bank',
        'Account Holder Name',
        'Account Number',
        'Branch Office of Bank',
      ],
      'Tax Information': ['Resource Status', 'NPWP Number', 'Name Tax'],
    };

    return categories;
  };

  const handleHoverDownload = (isHovered) => {
    setHoveredDownload(isHovered);
  };

  const dropdownClass = `mx-[10px] absolute top-[1px] right-[200px] bg-white border border-gray-200 rounded-[10px] shadow-md w-[131px] h-[110px] ${
    hoveredDownload ? 'visible opacity-100' : 'invisible opacity-0'
  } transition-all duration-300`;

  const renderRow = (template, index, startIndex, showActions) => (
    <tr
      key={template.template_id}
      className="bg-white hover:bg-[#F4F7FE] text-sm text-gray-700 h-[57px]"
    >
      <td className="py-2 border-b border-l border-[#E9E9E9] text-center">
        {startIndex + index + 1}
      </td>
      <td className="py-2 border-b border-[#E9E9E9]">
        {template.template_name}
      </td>
      {showActions && (
        <td className="py-2 border-b border-r border-[#E9E9E9]">
          <ActionButton
            isOpen={openActionId === template.template_id}
            toggle={() => toggleActionDropdown(template.template_id)}
            label="ACTION"
          >
            <div className="mx-[10px]">
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px] relative"
                onMouseEnter={() => handleHoverDownload(true)}
                onMouseLeave={() => handleHoverDownload(false)}
              >
                <Download set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Download</span>
                <div className={dropdownClass}>
                  <ul>
                    <li
                      className="m-2 py-2 px-3 cursor-pointer hover:bg-[#F4F7FE] flex items-center rounded-[10px]"
                      onClick={() => {
                        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation/${template.template_id}/export/xlsx`;
                        handleHoverDownload(false);
                      }}
                    >
                      <FileXls size={24} />
                      <span className="ml-2">XLS</span>
                    </li>
                    <li
                      className="m-2 py-2 px-3 cursor-pointer hover:bg-[#F4F7FE] flex items-center rounded-[10px]"
                      onClick={() => {
                        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/master-data/templates/translation/${template.template_id}/export/csv`;
                        handleHoverDownload(false);
                      }}
                    >
                      <FileCsv size={24} />
                      <span className="ml-2">CSV</span>
                    </li>
                  </ul>
                </div>
              </button>
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() => handleShowEditPopup(template)}
              >
                <Edit set="two-tone" size={24} className="mx-[10px]" />
                <span className="text-[14px]">Edit</span>
              </button>
              <button
                className="flex items-center w-full h-[40px] hover:bg-[#F4F7FE] mb-[5px] rounded-[8px]"
                onClick={() => {
                  setTemplateToDelete(template);
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
        <div className="flex gap-4">
          <Button
            className="bg-[#DC362E] border w-[131px] h-[48px] border-[#E9E9E9] hover:bg-[#DC362E]"
            onClick={handleShowAddPopup}
          >
            <Plus className="w-4 h-4 text-white" size={24} weight="bold" />
            <span className="text-white">Add Data</span>
          </Button>
        </div>
      </div>
      <div className="px-8 pt-2 pb-8">
        <BaseTable
          key={tableKey}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          apiUrl="master-data/templates/translation"
          renderRow={renderRow}
          renderHeader={renderHeader}
          showActions={true}
        />
      </div>

      <Popup
        show={showPopup}
        onSave={handleSaveTemplate}
        onClose={() => {
          handleCancelPopup();
          resetFormState();
        }}
        title={popupMode === 'edit' ? 'Edit Template' : 'Add Template'}
        icon={popupMode === 'edit' ? Edit : PaperPlus}
      >
        <div>
          <label className="block mb-1 text-[14px] text-black">
            Template Name
          </label>
          <input
            type="text"
            value={currentData?.template_name || ''}
            onChange={(e) =>
              setCurrentData({
                ...currentData,
                template_name: e.target.value,
              })
            }
            className={`w-full px-4 py-4 rounded-[15px] text-[14px] border focus:outline-none ${
              duplicateTemplateNameError && formSubmitted
                ? 'border-[#DC362E] focus:border-[#065BCC]'
                : 'border-[#BBBBBB] focus:border-[#065BCC]'
            }`}
            placeholder="Template Name"
          />

          {duplicateTemplateNameError && !formSubmitted && (
            <p className="text-[#DC362E] text-[14px]">
              Template name is already used
            </p>
          )}
          {!currentData?.template_name && formSubmitted && (
            <p className="text-[#DC362E] text-[14px]">
              Template name cannot be empty
            </p>
          )}

          <p className="text-[14px] mb-4 mt-4">Variables</p>

          <div className="grid grid-cols-3 gap-5">
            {Object.entries(groupedVariables()).map(([category, vars]) => (
              <div key={category} className="mb-6">
                <p className="text-[14px] mb-2">{category}</p>

                {vars.map((variable) => (
                  <div key={variable} className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id={variable}
                      className="mr-2 h-[18px] w-[18px]"
                      checked={selectedVariables.includes(variable)}
                      onChange={(e) => handleCheckboxChange(e, variable)}
                      disabled={defaultVariables.includes(variable)}
                    />
                    <label htmlFor={variable} className="text-[14px]">
                      {variable}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <hr className="border border-[#E9E9E9]" />

          <p className="text-[14px] my-4">Selected Variables</p>

          <div className="grid grid-cols-3 gap-1">
            {selectedVariables.map((variable, index) => (
              <div key={index} className="flex items-center">
                <span className="text-[14px]">{index + 1}.</span>
                <span className="text-[14px] ml-2">{variable}</span>
              </div>
            ))}
          </div>
        </div>
      </Popup>

      <PopupDelete
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteTemplate}
      />

      <Footer />
    </div>
  );
}
