import { PropsWithChildren } from "react";
import { Card, Logo } from "src/ui";
import "./styles.scss";

type Props = {};

export const MenuCard = ({ children }: PropsWithChildren<Props>) => {
  return (
    <div className="menu-wrapper">
      <Logo />

      <Card>{children}</Card>
    </div>
  );
};
