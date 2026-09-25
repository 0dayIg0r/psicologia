import { Input } from "@/components/ui/input";

export function FormField({
  id,
  label,
  error,
  hint,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}) {
  const descriptionId = `${id}-description`;
  return (
    <div className="auth-field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        {...props}
      />
      {error ? <p id={descriptionId} className="field-error" role="alert">{error}</p> : null}
      {!error && hint ? <p id={descriptionId} className="field-hint">{hint}</p> : null}
    </div>
  );
}
