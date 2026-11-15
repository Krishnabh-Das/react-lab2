// Lab day (AI required). Form raises "add this course" — CONTRACT.md §4.
import { useState } from "react";

const EMPTY = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

export function AddCourseForm({ onAdd }) {
  const [fields, setFields] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function setField(name, value) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await onAdd({
        code: fields.code,
        title: fields.title,
        department: fields.department,
        credits: Number(fields.credits),
        capacity: Number(fields.capacity),
        description: fields.description === "" ? null : fields.description,
      });
      setFields(EMPTY);
    } catch (err) {
      setFormError(err.message);
      setFieldErrors(err.fieldErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-course" onSubmit={handleSubmit}>
      <h2>Add a course</h2>

      <div className="field">
        <label htmlFor="code">Code</label>
        <input
          id="code"
          value={fields.code}
          onChange={(e) => setField("code", e.target.value)}
          aria-invalid={fieldErrors.code ? "true" : undefined}
          aria-describedby={fieldErrors.code ? "code-error" : undefined}
        />
        {fieldErrors.code && (
          <p id="code-error" className="field-error">
            {fieldErrors.code}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={fields.title}
          onChange={(e) => setField("title", e.target.value)}
          aria-invalid={fieldErrors.title ? "true" : undefined}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
        {fieldErrors.title && (
          <p id="title-error" className="field-error">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="department">Department</label>
        <input
          id="department"
          value={fields.department}
          onChange={(e) => setField("department", e.target.value)}
          aria-invalid={fieldErrors.department ? "true" : undefined}
          aria-describedby={fieldErrors.department ? "department-error" : undefined}
        />
        {fieldErrors.department && (
          <p id="department-error" className="field-error">
            {fieldErrors.department}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="credits">Credits</label>
        <input
          id="credits"
          type="number"
          value={fields.credits}
          onChange={(e) => setField("credits", e.target.value)}
          aria-invalid={fieldErrors.credits ? "true" : undefined}
          aria-describedby={fieldErrors.credits ? "credits-error" : undefined}
        />
        {fieldErrors.credits && (
          <p id="credits-error" className="field-error">
            {fieldErrors.credits}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          type="number"
          value={fields.capacity}
          onChange={(e) => setField("capacity", e.target.value)}
          aria-invalid={fieldErrors.capacity ? "true" : undefined}
          aria-describedby={fieldErrors.capacity ? "capacity-error" : undefined}
        />
        {fieldErrors.capacity && (
          <p id="capacity-error" className="field-error">
            {fieldErrors.capacity}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={fields.description}
          onChange={(e) => setField("description", e.target.value)}
        />
        {fieldErrors.description && (
          <p id="description-error" className="field-error">
            {fieldErrors.description}
          </p>
        )}
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
      <button type="submit" disabled={submitting}>
        Add course
      </button>
    </form>
  );
}
