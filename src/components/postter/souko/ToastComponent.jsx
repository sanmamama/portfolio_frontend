import React, { useEffect, useRef } from 'react';

const ToastComponent = ({ messages }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (toastRef.current) {
      const toastElement = new window.bootstrap.Toast(toastRef.current);
      toastElement.show();
    }
  }, [messages]);

  return (
    <div className="toast-container position-fixed">
      <div
        id="liveToast"
        className="toast position-fixed top-0 start-50 translate-middle-x m-1"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref={toastRef}
      >
        <div className="toast-body">{messages}</div>
      </div>
    </div>
  );
};

export default ToastComponent;
