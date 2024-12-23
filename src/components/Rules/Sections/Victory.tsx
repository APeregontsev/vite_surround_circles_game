import rules_victory from "src/assets/rules_victory.png";

type Props = {};

export const Victory = ({}: Props) => {
  return (
    <>
      <div className="rules-img-wrapper">
        <img src={rules_victory} alt="alt_surround" className="rules-img" />
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
            <p>The winner is the one who surrounds more dots;</p>
          </li>
        </ul>
      </section>
    </>
  );
};
