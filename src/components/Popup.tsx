import React from "react";
import { usePopup } from "../contexts/PopupContext";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onReject: () => void;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  onConfirm,
  onReject,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {message}
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="btn bg-primary text-on-primary" onClick={onReject}>
            No
          </button>
          <button className="btn" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

interface InfoPopupProps {
  message: string;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ message }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button>Close</button>
      </div>
    </div>
  );
};

interface GenericPopupProps {
  content: React.ReactNode;
}

export const GenericPopup: React.FC<GenericPopupProps> = ({ content }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {content}
        <button>Close</button>
      </div>
    </div>
  );
};

export const Popup: React.FC = () => {
  const { popupContent, hidePopup } = usePopup();

  if (!popupContent) return null; // Don't render anything if there's no popup content

  // Render different popups based on the content type
  if (React.isValidElement(popupContent)) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        onClick={hidePopup}
      >
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {popupContent}
        </div>
      </div>
    );
  }

  return null;
};
