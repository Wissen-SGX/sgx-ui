import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";

export function useAppForm<TFieldValues extends FieldValues>(
  schema: ZodTypeAny,
  defaultValues: TFieldValues,
  options?: Omit<UseFormProps<TFieldValues>, "resolver" | "defaultValues">,
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    mode: options?.mode ?? "onTouched",
  });
}
