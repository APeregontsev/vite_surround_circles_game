import React, { ReactElement } from "react";
import { Button } from "src/ui";
import { Stepper } from "../Stepper/Stepper";
import { Steps } from "./Sections/Steps";
import { Surround } from "./Sections/Surround";
import { Victory } from "./Sections/Victory";
import "./styles.scss";

type Props = { toggleRules: () => void };

export const Rules = ({ toggleRules }: Props) => {
  const [activeStep, setActiveStep] = React.useState<number>(1);

  const rulesCards: Record<number, ReactElement> = { 1: <Steps />, 2: <Surround />, 3: <Victory /> };

  const stepsCount = Object.keys(rulesCards ?? {}).length;

  return (
    <div className="rules-wrapper">
      <h1 style={{ textAlign: "center" }}>RULES</h1>

      {rulesCards[activeStep]}

      <Stepper steps={stepsCount} currentStep={activeStep} setActiveStep={setActiveStep} />
      <Button fullwidth type="submit" onClick={toggleRules}>
        Ok
      </Button>
    </div>
  );
};
