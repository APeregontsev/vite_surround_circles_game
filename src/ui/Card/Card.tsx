import "./styles.scss";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="body-wrapper">{children}</div>;
};
