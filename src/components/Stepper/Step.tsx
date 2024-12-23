import cn from "clsx";
import "./styles.scss";

type Props = { active?: boolean };

export function Step({ active }: Props) {
  return (
    <div
      className={cn("step-styles", {
        active: active,
      })}
    ></div>
  );
}
