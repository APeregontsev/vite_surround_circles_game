import rules_steps from "src/assets/rules_steps.png";

type Props = {};

export const Steps = ({}: Props) => {
  return (
    <>
      <div className="rules-img-wrapper">
        <img src={rules_steps} alt="alt_steps" className="rules-img" />
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

            <p>The goal of the game is to surround opponent's dots;</p>
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

            <p>One surrounded dot equals one point;</p>
          </li>
        </ul>
      </section>
    </>
  );
};
