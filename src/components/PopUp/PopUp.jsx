import { X } from '@phosphor-icons/react';
import Button from '../Button';

const Popup = ({
  show,
  onClose,
  onSave,
  children,
  className,
  title,
  icon: IconComponent,
}) =>
  show && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div
        className={`bg-white p-8 rounded-[25px] shadow-md relative overflow-y-auto custom-scrollbar max-h-[80vh] ${className}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {IconComponent && (
              <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full mr-6 mt-4 mb-6 border border-[#E9E9E9]">
                <IconComponent size={26} set="two-tone" />
              </div>
            )}
            <p className="font-semibold text-[18px] pb-2">{title}</p>
          </div>
          <Button
            className="absolute top-5 right-6 text-[#BBB] hover:text-[#DC362E] transition-all duration-200"
            onClick={onClose}
          >
            <X size={32} />
          </Button>
        </div>
        <hr className="mb-6" />
        <div className="mb-10 relative">{children}</div>
        <div className="flex justify-center">
          <Button
            className="bg-white text-black px-4 py-3 rounded-[8px] w-[120px] border border-[#BBBBBB] mr-2"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#DC362E] text-white px-4 py-3 rounded-[8px] w-[120px]"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );

export default Popup;
