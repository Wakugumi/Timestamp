import React from "react";
import { usePopup } from "../contexts/PopupContext";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ message, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <div>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onConfirm}>No</button>
        </div>
      </div>
    </div>
  );
};

interface InfoPopupProps {
  message: string;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ message }) => {
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

const GenericPopup: React.FC<GenericPopupProps> = ({ content }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {content}
        <button>Close</button>
      </div>
    </div>
  );
};

const Popup: React.FC = () => {
  const { popupContent, hidePopup } = usePopup();

  if (!popupContent) return null; // Don't render anything if there's no popup content

  // Render different popups based on the content type
  if (React.isValidElement(popupContent)) {
    return (
      <div className="popup-overlay" onClick={hidePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          {popupContent}
        </div>
      </div>
    );
  }

  return null;
};

module.exports = { GenericPopup, InfoPopup, ConfirmPopup, Popup };
