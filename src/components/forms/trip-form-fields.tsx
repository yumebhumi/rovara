"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { TripFormValues } from "@/lib/validations/trip-schema";
import { TRIP_VIBE_CONFIG } from "@/lib/trip-vibes";
import { AnimatedFormField } from "./animated-form-field";
import { BudgetSlider } from "./budget-slider";
import { DateRangeField } from "./date-range-field";
import { DestinationInput } from "./destination-input";
import { TripVibeSelector } from "./trip-vibe-selector";

type SharedFieldProps = {
  disabled?: boolean;
};

export function DestinationField({ disabled = false }: SharedFieldProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<TripFormValues>();

  return (
    <AnimatedFormField
      id="destination"
      label="Destination"
      error={errors.destination?.message}
      messageId="destination-message"
      required
    >
      <Controller
        control={control}
        name="destination"
        render={({ field }) => (
          <DestinationInput
            id="destination"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            error={Boolean(errors.destination)}
            describedBy="destination-message"
            invalid={Boolean(errors.destination)}
          />
        )}
      />
    </AnimatedFormField>
  );
}

export function TravelDatesField({ disabled = false }: SharedFieldProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<TripFormValues>();

  return (
    <AnimatedFormField
      label="Travel dates"
      error={errors.startDate?.message || errors.endDate?.message}
      messageId="dates-message"
      required
    >
      <Controller
        control={control}
        name="startDate"
        render={({ field: startField }) => (
          <Controller
            control={control}
            name="endDate"
            render={({ field: endField }) => (
              <DateRangeField
                startDate={startField.value}
                endDate={endField.value}
                onStartDateChange={startField.onChange}
                onEndDateChange={endField.onChange}
                onStartDateBlur={startField.onBlur}
                onEndDateBlur={endField.onBlur}
                disabled={disabled}
                startError={Boolean(errors.startDate)}
                endError={Boolean(errors.endDate)}
                describedBy="dates-message"
              />
            )}
          />
        )}
      />
    </AnimatedFormField>
  );
}

export function BudgetField({ disabled = false }: SharedFieldProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<TripFormValues>();
  const destination = useWatch({ control, name: "destination" });

  return (
    <AnimatedFormField
      label="Budget"
      hint={destination ? `Budgeting around ${destination}` : "Set a total trip budget"}
      error={errors.budget?.message}
      messageId="budget-message"
      required
    >
      <Controller
        control={control}
        name="budget"
        render={({ field }) => (
          <BudgetSlider
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            destination={destination}
            describedBy="budget-message"
            invalid={Boolean(errors.budget)}
          />
        )}
      />
    </AnimatedFormField>
  );
}

export function TravelVibeField({ disabled = false }: SharedFieldProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<TripFormValues>();
  const vibes = useWatch({ control, name: "vibes" }) ?? [];
  const vibeHint =
    vibes.length === 1
      ? TRIP_VIBE_CONFIG[vibes[0]].detail
      : vibes.length > 1
        ? `${vibes.join(" • ")} selected. Rovara will blend these moods into one balanced trip.`
        : undefined;

  return (
    <AnimatedFormField
      label="Travel vibe"
      hint={vibeHint}
      error={errors.vibes?.message}
      messageId="vibe-message"
      required
    >
      <Controller
        control={control}
        name="vibes"
        render={({ field }) => (
          <TripVibeSelector
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            describedBy="vibe-message"
            invalid={Boolean(errors.vibes)}
          />
        )}
      />
    </AnimatedFormField>
  );
}
