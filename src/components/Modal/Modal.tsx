import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";
import "./styles.scss";

type Props = { toggleModal: () => void };

export const Modal = ({ toggleModal, children }: PropsWithChildren<Props>) => {
  useEffect(() => {
    // Close popup on Escape key pressed
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    };
    window.addEventListener("keydown", closeOnEscapePressed);

    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("keydown", closeOnEscapePressed);
    };
  }, []);

  const modalElement = document.getElementById("root");

  function onCloseHandler() {
    toggleModal();
  }

  return createPortal(
    <div className="modal-wrapper" onClick={onCloseHandler}>
      <div className="inner-body" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalElement!
  );
};
