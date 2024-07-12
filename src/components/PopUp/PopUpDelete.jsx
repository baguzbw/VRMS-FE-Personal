import axios from 'axios';
import React from 'react';
import { Delete } from 'react-iconly';
import Button from '../Button';

const PopupDelete = ({ show, onClose, onDelete }) =>
  show && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white w-[400px] p-6 rounded-[25px] shadow-md items-center">
        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-[20px] bg-[#FBEBEA] mx-auto mt-3 mb-6">
          <span>
            <Delete size={42} set="bulk" primaryColor="#DC362E" />
          </span>
        </div>
        <p className="text-[20px] font-semibold mb-4 text-center">
          Delete Data
        </p>
        <p className="text-[16px] mb-4 text-center">
          Are you sure you want to delete this data? <br /> Once it's gone, it's
          gone!
        </p>
        <div className="flex justify-center">
          <Button
            className="bg-white text-black px-4 py-3 rounded-[8px] w-[120px] border border-[#BBBBBB] mr-2"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#DC362E] text-white px-4 py-3 rounded-[8px] w-[120px]"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

export default PopupDelete;
