import { Button } from "src/ui";
import "./styles.scss";

type Props = { toggleStat: () => void };

export const Statistics = ({ toggleStat }: Props) => {
  return (
    <div className="stat-wrapper">
      <h1 style={{ textAlign: "center" }}>Statistics</h1>

      <section>No data . . . </section>

      <Button fullwidth type="submit" onClick={toggleStat}>
        Ok
      </Button>
    </div>
  );
};
