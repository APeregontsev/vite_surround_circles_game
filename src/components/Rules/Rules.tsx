import steps from "src/assets/steps.png";
import { Button } from "src/ui";
import "./styles.scss";

type Props = { toggleRules: () => void };

export const Rules = ({ toggleRules }: Props) => {
  return (
    <div className="rules-wrapper">
      <h1 style={{ textAlign: "center" }}>RULES</h1>
      <div>
        <img src={steps} alt="alt_steps" className="rules-img" />
      </div>

      <section>
        <ul className="rules-list">
          <li className="rules-list-item">
            <div
              style={{
                minWidth: "12px",
                minHeight: "12px",
                borderRadius: "50%",
                backgroundColor: "var(--Red)",
              }}
            ></div>
            <p>You need to surround your opponent's dots;</p>
          </li>
          <li className="rules-list-item">
            <div
              style={{
                minWidth: "12px",
                minHeight: "12px",
                borderRadius: "50%",
                backgroundColor: "var(--Blue)",
              }}
            ></div>
            <p>The winner is the one who surrounds more dots;</p>
          </li>
        </ul>
      </section>
      <Button fullwidth type="submit" onClick={toggleRules}>
        Ok
      </Button>
    </div>
  );
};
