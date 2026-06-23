import "../css/widget_errorPopup.css";

export default function ErrorPopup({
  open,
  title,
  message,
  onClose,
}) {
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