import { ReactNode, useId, Children, cloneElement, isValidElement } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();

  const child = Children.only(children);
  const enhanced = isValidElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>(child)
    ? cloneElement(child, {
        id: child.props.id ?? id,
        "aria-invalid": Boolean(error) || undefined,
        "aria-describedby": error || hint ? `${id}-msg` : undefined,
      })
    : child;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {enhanced}
      {(error || hint) && (
        <span id={`${id}-msg`} className={`text-xs ${error ? "text-danger" : "text-fg-subtle"}`}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
