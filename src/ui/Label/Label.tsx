import "./styles.scss";

type TLabel = { text?: string; id?: string };

export const Label = ({ text, id }: TLabel) => {
  return (
    <label className="input-title" htmlFor={id}>
      {text}
    </label>
  );
};
