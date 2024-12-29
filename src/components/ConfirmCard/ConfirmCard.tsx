import { Button } from "src/ui";
import "./styles.scss";

type Props = {
  onCancel: () => void;
  onCancelText: string;
  onConfirmText: string;
  onConfirm: () => void;
  title: string;
  subTitle?: string;
  confirmRed?: boolean;
  cancelRed?: boolean;
};

export const ConfirmCard = ({
  onCancel,
  onCancelText,
  onConfirmText,
  onConfirm,
  title,
  subTitle,
  confirmRed = false,
  cancelRed = false,
}: Props) => {
  return (
    <div className="pause-wrapper">
      <h1 style={{ textAlign: "center", marginBottom: "32px" }}>{title}</h1>

      {subTitle && <p className="confirm-subtitle">{subTitle}</p>}

      <div className="btn-wrapper">
        <Button
          outlined={cancelRed ? false : true}
          fullwidth
          onClick={onCancel}
          type={cancelRed ? "submit" : "reset"}
          purple={cancelRed}
        >
          {onCancelText}
        </Button>

        <Button fullwidth type="submit" onClick={onConfirm} purple={confirmRed}>
          {onConfirmText}
        </Button>
      </div>
    </div>
  );
};
