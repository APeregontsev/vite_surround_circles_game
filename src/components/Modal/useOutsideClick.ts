import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type TypeOut = {
  ref: any;
};

export const useOutsideClick = (setIsShow: Dispatch<SetStateAction<boolean>>): TypeOut => {
  const ref = useRef<HTMLElement>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref };
};
