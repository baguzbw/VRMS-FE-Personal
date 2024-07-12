import Logo from '../../assets/StarSoftware.png';
import SideMenu from './SideMenu';

export default function Sidebar() {
  return (
    <div
      className="border border-r border-[#E9E9E9] w-[274px] bg-white py-[30px]"
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="flex flex-row place-content-center mb-[50px]">
        <img src={Logo} alt="star" />
      </div>
      <div>
        <SideMenu />
      </div>
    </div>
  );
}
