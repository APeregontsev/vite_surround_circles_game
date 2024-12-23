import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "src/ui";
import { Step } from "./Step";
import "./styles.scss";
type Props = {
  steps: number;
  currentStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export function Stepper({ steps, currentStep, setActiveStep }: Props) {
  const stepsRender = Array.from({ length: steps }, (_, i) => i + 1);

  const handleBack = () => {
    if (currentStep === 1) return;
    setActiveStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep === steps) return;
    setActiveStep(currentStep + 1);
  };

  const isDisabledBack = currentStep === 1;
  const isDisabledNext = currentStep === steps;

  return (
    <div className="stepper-wrapper-styles">
      <div className="stepper-btn-wrapper">
        <Button text onClick={handleBack} disabled={isDisabledBack}>
          <ChevronLeft color={"inherit"} height={"24px"} />
        </Button>
      </div>

      <div className="steps-wrapper-styles">
        {stepsRender.map((step) => (
          <Step key={step} active={step <= currentStep} />
        ))}
      </div>

      <div className="stepper-btn-wrapper">
        <Button text onClick={handleNext} disabled={isDisabledNext}>
          <ChevronRight color={"inherit"} height={"24px"} />
        </Button>
      </div>
    </div>
  );
}
