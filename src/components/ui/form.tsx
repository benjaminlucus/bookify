"use client";

import * as React from "react";
import {
  Controller,  ControllerRenderProps,  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { cn } from "../../lib/utils";

export function Form<
  TFieldValues extends FieldValues = FieldValues,
>({
  form,
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & {
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <form
      data-is-submitting={form.formState.isSubmitting}
      className={cn("space-y-6", className)}
      noValidate
      {...props}
    />
  );
}

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  render,
}: {
  control: UseFormReturn<TFieldValues>["control"];
  name: TName;
  render: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
}) {
  return <Controller control={control} name={name} render={render} />;
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "form-label text-base font-medium text-[#212a3b]", // Base shadcn label style
        className,
      )}
      {...props}
    />
  );
}

export function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function FormMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-destructive", className)} {...props} />
  );
}

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[rgba(33,42,59,0.7)]", className)} {...props} />
  );
}
