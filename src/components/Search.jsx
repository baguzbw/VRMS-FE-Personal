import PropTypes from 'prop-types';
import { Search } from 'react-iconly';

const SearchInput = ({ children }) => {
  return (
    <div className="w-72 h-12 flex items-center border border-[#E9E9E9] hover:border-[#065BCC] rounded-xl overflow-hidden bg-white">
      <span className="flex items-center justify-center pl-3 bg-transparent">
        <Search primaryColor="#DC362E" size={20} />
      </span>
      {children}
    </div>
  );
};

SearchInput.propTypes = {
  children: PropTypes.node,
};

export default SearchInput;
