import cn from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "./styles.scss";

type TButton = {
  outlined?: boolean;
  fullwidth?: boolean;
  icon?: boolean;
  text?: boolean;
  info?: boolean;
  active?: boolean;
  purple?: boolean;
};

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement> & TButton;

export const Button = ({
  outlined,
  fullwidth,
  children,
  icon,
  info,
  purple,
  active,
  text,
  ...rest
}: PropsWithChildren<TypeButton>) => {
  return (
    <button
      {...rest}
      className={cn("btn", {
        wide: fullwidth,
        outline: outlined,
        icon: icon,
        info: info,
        active: active,
        purple: purple,
        text: text,
      })}
    >
      <div className="btn-inner-wrapper">{children}</div>
    </button>
  );
};
