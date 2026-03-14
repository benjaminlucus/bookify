"use client";

import * as React from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
  UseFormStateReturn,
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

const FormFieldContext = React.createContext<{
  name: string;
  formState?: UseFormStateReturn<FieldValues>;
} | null>(null);

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
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={(props) => (
        <FormFieldContext.Provider value={{ name, formState: props.formState }}>
          {render(props)}
        </FormFieldContext.Provider>
      )}
    />
  );
}

const FormItemContext = React.createContext<{
  id: string;
  error?: string;
} | null>(null);

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();
  const context = React.useContext(FormFieldContext);
  const name = context?.name;
  const formState = context?.formState;
  const error = name && formState?.errors[name]?.message;

  return (
    <FormItemContext.Provider value={{ id, error: error as string }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
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
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error } = React.useContext(FormItemContext) || {};
  const body = error ? String(error) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[rgba(33,42,59,0.7)]", className)}
      {...props}
    />
  );
}
