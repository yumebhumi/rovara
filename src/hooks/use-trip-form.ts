"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  tripFormSchema,
  type TripFormValues
} from "@/lib/validations/trip-schema";

type UseTripFormOptions = {
  initialValues?: Partial<TripFormValues>;
};

export function useTripForm({ initialValues }: UseTripFormOptions) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      destination: initialValues?.destination ?? "",
      startDate: initialValues?.startDate ?? "",
      endDate: initialValues?.endDate ?? "",
      budget: initialValues?.budget ?? 0,
      vibes: initialValues?.vibes ?? []
    }
  });

  return {
    form
  };
}
