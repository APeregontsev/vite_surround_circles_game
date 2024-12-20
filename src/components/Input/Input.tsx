import cn from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "src/ui";
import "./styles.scss";

type TInput = { color?: "blue" | "red"; label?: string; empty?: boolean; errorMessage?: string };

type TypeInput = InputHTMLAttributes<HTMLInputElement> & TInput;

export const Input = forwardRef<HTMLInputElement, TypeInput>(
  ({ color, label, empty, errorMessage, ...rest }, ref) => {
    return (
      <div className={cn("input-wrapper", color, { empty: !!errorMessage })}>
        <Label id={rest.id} text={label} />

        <div className={cn("inner-input-wrapper", color)}>
          <input ref={ref} {...rest} className={cn("login-input", color)} />
          <p className="warning">{errorMessage}</p>
        </div>
      </div>
    );
  }
);
