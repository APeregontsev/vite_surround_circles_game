import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import "./styles.scss";
import { useCloseOnEscape } from "./useCloseOnEscape";

type Props = { toggleModal: () => void };

export const Modal = ({ toggleModal, children }: PropsWithChildren<Props>) => {
  const modalElement = document.getElementById("root");

  useCloseOnEscape(toggleModal);

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
