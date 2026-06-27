import "../styles/widget/errorPopup.css";
interface ErrorPopupProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}
 
export default function ErrorPopup({
  open,
  title,
  message,
  onClose,
}: ErrorPopupProps ) {
  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>⚠️ {title}</h3>

        <div className="popup-message">
          {message}
        </div>

        <button
          className="popup-button"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}