import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { usePreferences } from '../preferences/context'
import { contactCopy } from '../i18n/contact'
import { FlowArrow } from './FlowArrow'
import './trial.css'

const fields = ['name', 'email', 'phone', 'subject', 'message'] as const
type Field = (typeof fields)[number]
type Values = Record<Field, string>
type ErrorKey =
  'required' | 'nameInvalid' | 'emailInvalid' | 'phoneInvalid' | 'subjectInvalid' | 'messageInvalid'
type Errors = Partial<Record<Field, ErrorKey>>
const empty: Values = { name: '', email: '', phone: '', subject: '', message: '' }
const limits = { name: 100, email: 254, phone: 40, subject: 160, message: 2000 }
const errorKey: Record<Field, ErrorKey> = {
  name: 'nameInvalid',
  email: 'emailInvalid',
  phone: 'phoneInvalid',
  subject: 'subjectInvalid',
  message: 'messageInvalid',
}
function validate(values: Values): Errors {
  const errors: Errors = {}
  for (const field of fields) {
    const value = values[field].trim()
    if (!value && field !== 'phone') errors[field] = 'required'
    else if (value.length > limits[field]) errors[field] = errorKey[field]
    else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors[field] = 'emailInvalid'
    else if (
      field === 'phone' &&
      value &&
      (!/^\+?[0-9 ()\-.]+$/.test(value) ||
        value.replace(/\D/g, '').length < 7 ||
        value.replace(/\D/g, '').length > 15)
    )
      errors[field] = 'phoneInvalid'
    else if (
      [...value].some((char) => {
        const code = char.charCodeAt(0)
        return code === 127 || (code < 32 && !(field === 'message' && [9, 10, 13].includes(code)))
      })
    )
      errors[field] = errorKey[field]
  }
  return errors
}

export function ContactForm() {
  const { language } = usePreferences(),
    t = contactCopy[language]
  const [values, setValues] = useState<Values>(empty),
    [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [failure, setFailure] = useState<'invalid' | 'unavailable' | 'limited'>('unavailable')
  const pending = useRef(false),
    attempt = useRef<{ key: string; clientId: string } | null>(null)
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const first = Object.keys(errors)[0]
    if (state === 'error' && first)
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }, [errors, state])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (pending.current || state === 'success') return
    const invalid = validate(values)
    setErrors(invalid)
    if (Object.keys(invalid).length) {
      setFailure('invalid')
      setState('error')
      return
    }
    pending.current = true
    setState('pending')
    try {
      const normalized = Object.fromEntries(
        fields.map((field) => [field, values[field].trim()]),
      ) as Values
      normalized.email = normalized.email.toLowerCase()
      const key = JSON.stringify(normalized)
      if (!attempt.current || attempt.current.key !== key)
        attempt.current = { key, clientId: crypto.randomUUID() }
      const base = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')
      const response = await fetch(`${base}/public/contact-messages`, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...normalized,
          clientId: attempt.current.clientId,
          website: new FormData(form.current!).get('website') || '',
        }),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.received !== true) {
        if (response.status === 429) setFailure('limited')
        else if (response.status === 400 && result?.fields) {
          const fieldErrors: Errors = {}
          for (const field of fields) if (result.fields[field]) fieldErrors[field] = errorKey[field]
          setErrors(fieldErrors)
          setFailure('invalid')
        } else setFailure('unavailable')
        setState('error')
        return
      }
      setState('success')
    } catch {
      setFailure('unavailable')
      setState('error')
    } finally {
      pending.current = false
    }
  }
  return (
    <form
      className="trial-form contact-form"
      ref={form}
      onSubmit={submit}
      noValidate
      aria-labelledby="contact-form-title"
      aria-busy={state === 'pending'}
    >
      <h3 id="contact-form-title">{t.title}</h3>
      <p className="contact-form-intro">{t.intro}</p>
      <fieldset disabled={state === 'pending' || state === 'success'}>
        <legend className="sr-only">{t.title}</legend>
        <div className="contact-trap" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>
        {fields.map((name) => (
          <div
            className={`trial-field ${name === 'subject' || name === 'message' ? 'trial-field-wide' : ''}`}
            key={name}
          >
            <label htmlFor={`contact-${name}`}>
              {t[name]}
              {name === 'phone' && <span> ({t.optional})</span>}
            </label>
            {name === 'message' ? (
              <textarea
                id={`contact-${name}`}
                name={name}
                rows={5}
                required
                maxLength={limits[name]}
                value={values[name]}
                dir="auto"
                onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
              />
            ) : (
              <input
                id={`contact-${name}`}
                name={name}
                type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                autoComplete={
                  name === 'name'
                    ? 'name'
                    : name === 'email'
                      ? 'email'
                      : name === 'phone'
                        ? 'tel'
                        : 'off'
                }
                dir={name === 'email' || name === 'phone' ? 'ltr' : 'auto'}
                required={name !== 'phone'}
                maxLength={limits[name]}
                value={values[name]}
                onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={
                  [
                    name === 'phone' ? 'contact-phone-hint' : '',
                    errors[name] ? `contact-${name}-error` : '',
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined
                }
              />
            )}
            {name === 'phone' && <small id="contact-phone-hint">{t.phoneHint}</small>}
            {errors[name] && (
              <small className="trial-field-error" id={`contact-${name}-error`}>
                {t[errors[name]]}
              </small>
            )}
          </div>
        ))}
        <p className="contact-privacy trial-field-wide">{t.privacy}</p>
        <button className="button trial-submit contact-submit" type="submit">
          {state === 'pending' ? (
            <>
              <LoaderCircle className="trial-spinner" size={18} aria-hidden="true" />
              {t.pending}
            </>
          ) : (
            <>
              {state === 'error' ? t.retry : t.submit}
              <FlowArrow diagonal size={18} />
            </>
          )}
        </button>
      </fieldset>
      <div
        className="contact-feedback trial-feedback"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === 'success' && (
          <div className="contact-success trial-success">
            <Check size={22} aria-hidden="true" />
            <div>
              <strong>{t.successTitle}</strong>
              <p>{t.success}</p>
            </div>
          </div>
        )}
        {state === 'error' && <p className="trial-error">{t[failure]}</p>}
      </div>
    </form>
  )
}
