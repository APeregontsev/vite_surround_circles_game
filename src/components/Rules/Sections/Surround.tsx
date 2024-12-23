import rules_surround from "src/assets/rules_surround.png";

type Props = {};

export const Surround = ({}: Props) => {
  return (
    <>
      <div className="rules-img-wrapper">
        <img src={rules_surround} alt="alt_surround" className="rules-img" />
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
            <p>The dots must be surrounded on all four sides;</p>
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
            <p>Their total number in the surrounding is not limited;</p>
          </li>
        </ul>
      </section>
    </>
  );
};
