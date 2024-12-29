import React from "react";
import { Button } from "src/ui";
import { Stepper } from "../Stepper/Stepper";
import { RULES_CONFIG } from "./config";
import { RuleCard } from "./RuleCard";
import "./styles.scss";

type Props = { toggleRules: () => void };

export const Rules = ({ toggleRules }: Props) => {
  const [activeStep, setActiveStep] = React.useState<number>(1);

  const stepsCount = Object.keys(RULES_CONFIG ?? {}).length;

  return (
    <div className="rules-wrapper">
      <h1 style={{ textAlign: "center" }}>RULES</h1>

      <RuleCard rule={RULES_CONFIG[activeStep]} />

      <Stepper steps={stepsCount} currentStep={activeStep} setActiveStep={setActiveStep} />
      <Button fullwidth type="submit" onClick={toggleRules}>
        Ok
      </Button>
    </div>
  );
};
