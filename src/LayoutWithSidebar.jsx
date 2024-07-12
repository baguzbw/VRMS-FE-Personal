import { Outlet } from 'react-router-dom';
import Sidebar from './components/CompSide/Sidebar';

const LayoutWithSidebar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow ml-[274px]">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
