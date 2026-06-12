"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormProvider, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { type TripFormValues, tripGenerationBudgetMin } from "@/lib/validations/trip-schema";
import { assessBudgetRealism } from "@/lib/trip-budget";
import { useTripForm } from "@/hooks/use-trip-form";
import { useCurrency } from "@/providers";
import { panelTransition } from "@/styles/animations";
import { ProgressTracker } from "./progress-tracker";
import { StepContainer } from "./step-container";
import { SubmitButton } from "./submit-button";
import { ErrorState } from "./error-state";
import {
  BudgetField,
  DestinationField,
  TravelDatesField,
  TravelVibeField
} from "./trip-form-fields";

type Props = {
  initialValues?: Partial<TripFormValues>;
  onValuesChange?: (values: Partial<TripFormValues>) => void;
  onSubmitTrip: (values: TripFormValues) => Promise<void> | void;
  submitError?: string | null;
  submitting?: boolean;
  onClearError?: () => void;
};

const DESTINATION_SUGGESTIONS = ["Tokyo", "Paris", "Bali", "Lisbon", "Seoul", "Marrakech"];

const STEP_META = [
  {
    label: "Destination",
    eyebrow: "Journey setup",
    title: "Plan your journey",
    description:
      "Start with the destination. Rovara uses it to shape the route mood, local context, and travel rhythm."
  },
  {
    label: "Dates",
    eyebrow: "Travel window",
    title: "Choose your dates",
    description:
      "Choose the window and the itinerary starts to feel real. The AI uses it to pace each day with better judgment."
  },
  {
    label: "Budget",
    eyebrow: "Spend range",
    title: "Set a comfortable budget",
    description:
      "A clear budget helps Rovara balance stay quality, movement, and experience without adding extra complexity."
  },
  {
    label: "Travel vibes",
    eyebrow: "Atmosphere",
    title: "Shape the feeling",
    description:
      "Choose one or more moods. Rovara blends them into the right personality, pacing, and stay style."
  }
] as const;

export function GenerateTripForm({
  initialValues,
  onValuesChange,
  onSubmitTrip,
  submitError = null,
  submitting = false,
  onClearError
}: Props) {
  const { currency } = useCurrency();
  const [currentStep, setCurrentStep] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const { form } = useTripForm({
    initialValues
  });

  const {
    control,
    setValue,
    trigger,
    formState: { isSubmitting: formSubmitting }
  } = form;
  const liveValues = useWatch({ control });
  const isSubmitting = submitting || formSubmitting;
  const importedPlannerContext =
    initialValues?.destination || initialValues?.vibes?.length || initialValues?.startDate;
  const budgetAssessment = assessBudgetRealism({
    destination: liveValues.destination ?? "",
    budget: typeof liveValues.budget === "number" ? liveValues.budget : 0,
    budgetCurrency: currency
  });
  const destinationReady = (liveValues.destination ?? "").trim().length >= 2;
  const datesReady = Boolean(liveValues.startDate && liveValues.endDate);
  const budgetReady =
    typeof liveValues.budget === "number" &&
    liveValues.budget >= tripGenerationBudgetMin &&
    budgetAssessment.status !== "low";
  const vibeReady = (liveValues.vibes?.length ?? 0) > 0;
  const completedSteps = [destinationReady, datesReady, budgetReady, vibeReady];

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  useEffect(() => {
    onValuesChange?.({
      destination: liveValues.destination ?? initialValues?.destination ?? "",
      startDate: liveValues.startDate ?? initialValues?.startDate ?? "",
      endDate: liveValues.endDate ?? initialValues?.endDate ?? "",
      budget: liveValues.budget ?? initialValues?.budget ?? 0,
      vibes: liveValues.vibes ?? initialValues?.vibes ?? []
    });
  }, [initialValues, liveValues, onValuesChange]);

  const submit = form.handleSubmit(async (values) => {
    onClearError?.();
    await onSubmitTrip(values);
  });

  async function handleNextStep() {
    const stepFields: Array<Array<keyof TripFormValues>> = [
      ["destination"],
      ["startDate", "endDate"],
      ["budget"],
      ["vibes"]
    ];

    const valid = await trigger(stepFields[currentStep], { shouldFocus: true });
    if (!valid) return;

    setCurrentStep((previous) => Math.min(previous + 1, STEP_META.length - 1));
  }

  function handlePreviousStep() {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  function handleDestinationSuggestion(suggestion: string) {
    onClearError?.();
    setValue("destination", suggestion, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  }

  return (
    <FormProvider {...form}>
      <div className="relative">
        <motion.form
          onSubmit={submit}
          aria-busy={isSubmitting}
          aria-describedby={submitError ? "generate-trip-submit-error" : undefined}
          className="space-y-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={panelTransition}
        >
          {importedPlannerContext ? (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={panelTransition}
              className="rounded-[1.2rem] border border-[#14B8A6]/14 bg-[#14B8A6]/[0.07] px-4 py-3 text-sm leading-7 text-[#CBD5E1]"
            >
              Imported from the landing planner
              {initialValues?.vibes?.length
                ? ` • ${initialValues.vibes.join(" + ")} carried into the brief`
                : ""}
            </motion.div>
          ) : null}

          <div className="px-0.5">
            <ProgressTracker
              steps={STEP_META.map(({ label }) => ({ label }))}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 0 ? (
              <StepContainer
                key="destination"
                step={1}
                totalSteps={STEP_META.length}
                eyebrow={STEP_META[0].eyebrow}
                title={STEP_META[0].title}
                description={STEP_META[0].description}
              >
                <div className="space-y-6">
                  <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
                    Destination step
                  </h3>
                  <DestinationField disabled={isSubmitting} />

                  <div className="space-y-2.5">
                    <p className="text-[0.82rem] text-[#64748B]">
                      Try a destination
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {DESTINATION_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDestinationSuggestion(suggestion)}
                          aria-label={`Use ${suggestion} as destination`}
                          className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-[0.88rem] text-[#CBD5E1] transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#14B8A6]/18 hover:bg-[#14B8A6]/8 hover:text-[#F8FAF8] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepContainer>
            ) : null}

            {currentStep === 1 ? (
              <StepContainer
                key="dates"
                step={2}
                totalSteps={STEP_META.length}
                eyebrow={STEP_META[1].eyebrow}
                title={STEP_META[1].title}
                description={STEP_META[1].description}
              >
                <div className="space-y-6">
                  <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
                    Dates step
                  </h3>
                  <TravelDatesField disabled={isSubmitting} />
                </div>
              </StepContainer>
            ) : null}

            {currentStep === 2 ? (
              <StepContainer
                key="budget"
                step={3}
                totalSteps={STEP_META.length}
                eyebrow={STEP_META[2].eyebrow}
                title={STEP_META[2].title}
                description={STEP_META[2].description}
              >
                <div className="space-y-6">
                  <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
                    Budget step
                  </h3>
                  <BudgetField disabled={isSubmitting} />
                </div>
              </StepContainer>
            ) : null}

            {currentStep === 3 ? (
              <StepContainer
                key="vibe"
                step={4}
                totalSteps={STEP_META.length}
                eyebrow={STEP_META[3].eyebrow}
                title={STEP_META[3].title}
                description={STEP_META[3].description}
              >
                <div className="space-y-6">
                  <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
                    Travel vibe step
                  </h3>
                  <TravelVibeField disabled={isSubmitting} />
                </div>
              </StepContainer>
            ) : null}
          </AnimatePresence>

          <ErrorState id="generate-trip-submit-error" message={submitError} />

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.95rem] text-[#94A3B8]">
              {currentStep === STEP_META.length - 1
                ? "Everything is in place. Create the itinerary when it feels right."
                : "Complete this step, then continue."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isSubmitting || currentStep === 0}
                onClick={handlePreviousStep}
                aria-label="Go to previous form step"
                className="h-11 rounded-full border-white/[0.08] bg-white/[0.025] px-5 text-[#CBD5E1] hover:bg-white/[0.05]"
              >
                <ArrowLeft size={16} />
                Back
              </Button>

              {currentStep < STEP_META.length - 1 ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    (currentStep === 0 && !destinationReady) ||
                    (currentStep === 1 && !datesReady) ||
                    (currentStep === 2 && !budgetReady)
                  }
                  onClick={handleNextStep}
                  aria-label={`Continue to ${STEP_META[currentStep + 1]?.label ?? "next"} step`}
                  className="h-11 rounded-full border border-[#14B8A6]/24 bg-[linear-gradient(180deg,#23cab9_0%,#14B8A6_100%)] px-5 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#041311] shadow-[0_10px_24px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-[linear-gradient(180deg,#2ad2c0_0%,#17c3b0_100%)] hover:shadow-[0_14px_32px_rgba(20,184,166,0.18),0_0_0_1px_rgba(143,227,207,0.12)]"
                >
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <SubmitButton disabled={isSubmitting || !vibeReady} loading={isSubmitting} />
              )}
            </div>
          </div>
        </motion.form>

      </div>
    </FormProvider>
  );
}
