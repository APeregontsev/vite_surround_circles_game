import { TRule } from "./config";

type Props = { rule: TRule };

export const RuleCard = ({ rule }: Props) => {
  return (
    <>
      <div className="rules-img-wrapper">
        <img src={rule.img} alt="alt_steps" className="rules-img" />
      </div>
      <section>
        <ul className="rules-list">
          {rule.rules.map((ruleItem, index) => (
            <li className="rules-list-item" key={ruleItem.slice(0, 5)}>
              <div
                className="rule-item"
                style={{
                  backgroundColor: index % 2 === 0 ? "var(--Blue)" : "var(--Red)",
                }}
              ></div>

              <p>{ruleItem}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
