import { useState } from 'react';
import { ChevronDown } from 'react-iconly';

const DropdownButton = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(options[1].label);

  const items = options.map((option, index) => ({
    key: `${index}`,
    label: option.label,
    isHeader: index === 0, // Set the first item as a header
  }));

  const handleItemClick = (item) => {
    if (!item.isHeader) {
      setSelectedLabel(item.label);
      setIsOpen(false);
      onChange(item.label.toLowerCase());
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-[120px] h-[48px] text-[#232323] text-sm bg-white border border-[#E9E9E9] font-medium py-3 px-3 rounded-xl cursor-pointer"
      >
        <span className="overflow-hidden whitespace-nowrap ms-1 text-ellipsis">
          {selectedLabel}
        </span>
        <ChevronDown className="w-5 h-5" />
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-[120px] rounded-[10px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            {items.map((item) =>
              item.isHeader ? (
                <div
                  key={item.key}
                  className="text-[#BBBBBB] block px-4 py-2 text-[12px] font-semibold"
                >
                  {item.label}
                </div>
              ) : (
                <div key={item.key} className="m-1">
                  <a
                    href="#"
                    className="text-[#232323] block rounded-md px-3 py-2 text-sm hover:bg-[#FBEBEA]"
                    role="menuitem"
                    tabIndex="-1"
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item);
                    }}
                  >
                    {item.label}
                  </a>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
