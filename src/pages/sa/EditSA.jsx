import { FloppyDisk } from '@phosphor-icons/react';
import { Select, Tree, message } from 'antd';
import { useEffect, useState } from 'react';
import { Hide, Show } from 'react-iconly';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Navbar from '../../components/NavBar';

const masterDataTree = [
  {
    title: 'Variable Input Form',
    key: 'Variable Input Form',
    children: [
      {
        title: 'Translation',
        key: 'Variable Input Form-Translation',
        children: [
          { title: 'Create', key: 'Variable Input Form-Translation-Create' },
          { title: 'Edit', key: 'Variable Input Form-Translation-Edit' },
          { title: 'Delete', key: 'Variable Input Form-Translation-Delete' },
        ],
      },
      {
        title: 'Non Translation',
        key: 'Variable Input Form-Non Translation',
        children: [
          {
            title: 'Create',
            key: 'Variable Input Form-Non Translation-Create',
          },
          { title: 'Edit', key: 'Variable Input Form-Non Translation-Edit' },
          {
            title: 'Delete',
            key: 'Variable Input Form-Non Translation-Delete',
          },
        ],
      },
      {
        title: 'Vendor',
        key: 'Variable Input Form-Vendor',
        children: [
          { title: 'Create', key: 'Variable Input Form-Vendor-Create' },
          { title: 'Edit', key: 'Variable Input Form-Vendor-Edit' },
          { title: 'Delete', key: 'Variable Input Form-Vendor-Delete' },
        ],
      },
    ],
  },
  {
    title: 'Rate Type',
    key: 'Rate Type',
    children: [
      { title: 'Create', key: 'Rate Type-Create' },
      { title: 'Edit', key: 'Rate Type-Edit' },
      { title: 'Delete', key: 'Rate Type-Delete' },
    ],
  },
  {
    title: 'Financial Directory',
    key: 'Financial Directory',
    children: [
      { title: 'Create', key: 'Financial Directory-Create' },
      { title: 'Edit', key: 'Financial Directory-Edit' },
      { title: 'Delete', key: 'Financial Directory-Delete' },
    ],
  },
  {
    title: 'Tools',
    key: 'Tools',
    children: [
      { title: 'Create', key: 'Tools-Create' },
      { title: 'Edit', key: 'Tools-Edit' },
      { title: 'Delete', key: 'Tools-Delete' },
    ],
  },
];

const resourceManagerTree = [
  {
    title: 'Translation',
    key: 'Translation',
    children: [
      { title: 'Import', key: 'Translation-Import' },
      { title: 'Create', key: 'Translation-Create' },
      { title: 'Edit', key: 'Translation-Edit' },
      { title: 'Delete', key: 'Translation-Delete' },
      {
        title: 'PM Notes',
        key: 'Translation-PM Notes',
        children: [
          { title: 'Approve', key: 'Translation-PM Notes-Approve' },
          { title: 'Create', key: 'Translation-PM Notes-Create' },
        ],
      },
      {
        title: 'Rating',
        key: 'Translation-Rating',
        children: [{ title: 'Create', key: 'Translation-Rating-Create' }],
      },
    ],
  },
  {
    title: 'Non Translation',
    key: 'Non Translation',
    children: [
      { title: 'Import', key: 'Non Translation-Import' },
      { title: 'Create', key: 'Non Translation-Create' },
      { title: 'Edit', key: 'Non Translation-Edit' },
      { title: 'Delete', key: 'Non Translation-Delete' },
      {
        title: 'PM Notes',
        key: 'Non Translation-PM Notes',
        children: [
          { title: 'Approve', key: 'Non Translation-PM Notes-Approve' },
          { title: 'Create', key: 'Non Translation-PM Notes-Create' },
        ],
      },
      {
        title: 'Rating',
        key: 'Non Translation-Rating',
        children: [{ title: 'Create', key: 'Non Translation-Rating-Create' }],
      },
    ],
  },
  {
    title: 'Vendor',
    key: 'Vendor',
    children: [
      { title: 'Import', key: 'Vendor-Import' },
      { title: 'Create', key: 'Vendor-Create' },
      { title: 'Edit', key: 'Vendor-Edit' },
      { title: 'Delete', key: 'Vendor-Delete' },
      {
        title: 'PM Notes',
        key: 'Vendor-PM Notes',
        children: [
          { title: 'Approve', key: 'Vendor-PM Notes-Approve' },
          { title: 'Create', key: 'Vendor-PM Notes-Create' },
        ],
      },
      {
        title: 'Rating',
        key: 'Vendor-Rating',
        children: [{ title: 'Create', key: 'Vendor-Rating-Create' }],
      },
    ],
  },
];

export default function EditSystemAdmin() {
  useEffect(() => {
    document.title = 'System Administrator - VRMS';
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [masterDataSelectedKeys, setMasterDataSelectedKeys] = useState([]);
  const [resourceManagerSelectedKeys, setResourceManagerSelectedKeys] =
    useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/system-administrator/${id}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setFullName(data.full_name);
          setEmail(data.email);
          setPassword(data.original_password);
          setRole(data.role);
          //SET FOR MENU
          const masterDataKeys = [];
          const resourceManagerKeys = [];
          data.menu.forEach((item) => {
            if (item['Master Data']) {
              masterDataKeys.push(...Object.keys(item['Master Data']));
            }
            if (item['Resource Manager']) {
              resourceManagerKeys.push(
                ...Object.keys(item['Resource Manager'])
              );
            }
          });

          setMasterDataSelectedKeys(masterDataKeys);
          setResourceManagerSelectedKeys(resourceManagerKeys);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChangeRole = (value) => {
    setRole(value);
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
  ];

  const formatMenuData = (menu) => {
    return Object.entries(menu).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        acc[key] = formatMenuData(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  const handleSubmit = async () => {
    const masterData = buildTree(masterDataSelectedKeys, masterDataTree);
    const resourceManager = buildTree(
      resourceManagerSelectedKeys,
      resourceManagerTree
    );

    const data = {
      full_name: fullName,
      email: email,
      password: password,
      role: role,
      menu: [
        { 'Master Data': formatMenuData(masterData) },
        { 'Resource Manager': formatMenuData(resourceManager) },
      ],
    };

    console.log('Submitting data:', data);

    try {
      const response = await api.patch(
        `${import.meta.env.VITE_API_BASE_URL}/system-administrator/${id}`,
        data
      );
      console.log(response.data);
      message.success('Data Updated Successfully!');
      navigate('/system-administrator');
    } catch (error) {
      console.error('There was an error!', error);
      message.error('Failed To Update Data.');
    }
  };

  const buildTree = (selectedKeys, treeData) => {
    const buildSubTree = (keys, tree) => {
      const result = {};
      tree.forEach((node) => {
        if (keys.includes(node.key)) {
          if (node.children) {
            result[node.title] = buildSubTree(keys, node.children);
          } else {
            const action = node.title.split(' ').pop();
            if (!result[node.title]) {
              result[node.title] = action;
            }
          }
        } else if (node.children) {
          const childrenResult = buildSubTree(keys, node.children);
          if (Object.keys(childrenResult).length > 0) {
            result[node.title] = childrenResult;
          }
        }
      });
      return result;
    };

    return buildSubTree(selectedKeys, treeData);
  };

  return (
    <div>
      <Navbar />
      <div className="p-8 pt-8 flex justify-between gap-4">
        <div className="text-xl font-medium">Edit Data</div>
      </div>
      <div className="px-8 pt-1 pb-8">
        <div className="w-full bg-white shadow-md rounded-lg p-8 flex flex-col items-center">
          <div className="w-full flex justify-between mb-8">
            <div className="w-1/2 pr-4">
              <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Show size="medium" set="two-tone" />
                  ) : (
                    <Hide size="medium" set="two-tone" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <div className="relative">
                <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-4 rounded-[15px] mb-6 text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label className="block mb-1 text-[14px] text-[#9A9A9A]">
                  Role
                </label>
                <Select
                  className="rounded-select"
                  showSearch
                  placeholder="Select Role"
                  optionFilterProp="children"
                  onChange={handleChangeRole}
                  style={{
                    width: '100%',
                    height: '55px',
                    marginBottom: '24px',
                  }}
                  options={roleOptions}
                  value={role}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <div className="w-1/2 pr-4">
              <div className="font-medium mb-2">Master Data</div>
              <Tree
                checkable
                checkedKeys={masterDataSelectedKeys}
                onCheck={(keys) => setMasterDataSelectedKeys(keys)}
                treeData={masterDataTree}
              />
            </div>
            <div className="w-1/2 pl-2">
              <div className="font-medium mb-2">Resource Manager</div>
              <Tree
                checkable
                checkedKeys={resourceManagerSelectedKeys}
                onCheck={(keys) => setResourceManagerSelectedKeys(keys)}
                treeData={resourceManagerTree}
              />
            </div>
          </div>
          <div className="w-full flex justify-end mt-12">
            <Button
              className="bg-[#DC362E] border w-[131px] h-[48px] hover:bg-[#DC362E]"
              onClick={handleSubmit}
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
      <Footer />
    </div>
  );
}
