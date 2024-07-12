import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '../assets/Avatar2.jpg';

export default function Navbar() {
  const { pathname } = useLocation();
  const [user, setUser] = useState({ name: '', role: '' });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser({
        name: parsedUserData.name,
        role: parsedUserData.role,
      });
    }
  }, []);

  const pathnames = pathname.split('/').filter((x) => x);

  const shouldDisplay = (segment) => {
    const excludeList = ['add', 'edit', 'show'];
    return (
      !excludeList.includes(segment) &&
      !(segment.length > 10 && /[0-9]/.test(segment))
    );
  };

  const formatSegment = (segment) => {
    if (isNaN(segment)) {
      return segment.split('-').map(capitalize).join(' ');
    }
    return segment;
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const filteredPathnames = pathnames.filter(shouldDisplay);
  const currentPageName =
    filteredPathnames.length > 0
      ? formatSegment(filteredPathnames[filteredPathnames.length - 1])
      : 'VRMS';

  return (
    <div className="flex justify-between items-center bg-white">
      <div className="px-9 py-4 h-[116px]">
        <div className="text-xs text-[#9A9A9A]">
          <nav aria-label="breadcrumb">
            <ol className="list-none p-0 inline-flex mt-[15px]">
              <li className="inline-flex items-center">
                <div className="text-[#9A9A9A]">VRMS</div>
              </li>
              {filteredPathnames.map((value, index) => {
                const last = index === filteredPathnames.length - 1;
                const to = `/${filteredPathnames.slice(0, index + 1).join('/')}`;
                return (
                  <React.Fragment key={to}>
                    <li className="inline-flex items-center text-[#9A9A9A]">
                      <span className="mx-1">/</span>
                    </li>
                    <li
                      className={`inline-flex items-center ${last ? '' : 'text-[#9A9A9A]'}`}
                    >
                      {last ? (
                        <span className="text-[#9A9A9A]">
                          {formatSegment(value)}
                        </span>
                      ) : (
                        <div className="text-[#9A9A9A] ">
                          {formatSegment(value)}
                        </div>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        </div>
        <div className="text-2xl font-semibold text-[#232323]">
          {currentPageName}
        </div>
      </div>

      <div>
        <div className="flex items-center bg-[#F9F9F9] rounded-[100px] py-2 px-4 mr-9">
          <div className="p-2">
            <img
              src={Avatar}
              alt="star"
              style={{
                borderRadius: '50%',
                width: '45px',
                height: '45px',
              }}
            />
          </div>
          <div className="ml-1">
            <div className="font-bold text-[16px] text-[#292929] mr-[8px]">
              {user.name}
            </div>
            <div className="text-[14px] text-[#B5B5B5]">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
