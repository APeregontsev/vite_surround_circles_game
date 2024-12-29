import React from "react";

type Props = () => void;

export function useCloseOnEscape(onEscPressed: Props) {
  React.useEffect(() => {
    // Close popup on Escape key pressed
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscPressed();
      }
    };
    window.addEventListener("keydown", closeOnEscapePressed);

    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("keydown", closeOnEscapePressed);
    };
  }, []);
}
