import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { usePreferences } from '../preferences/context'
import { trialCopy } from '../i18n/trial'
import { FlowArrow } from './FlowArrow'
import './trial.css'

const fields = ['restaurantName', 'applicantName', 'email', 'phone', 'message'] as const
type Field = (typeof fields)[number]
type Values = Record<Field, string>
type ErrorKey = 'required' | 'emailInvalid' | 'phoneInvalid' | 'nameInvalid' | 'messageInvalid'
type Errors = Partial<Record<Field, ErrorKey>>
const empty: Values = { restaurantName: '', applicantName: '', email: '', phone: '', message: '' }

function validate(values: Values): Errors {
  const errors: Errors = {}
  for (const name of fields) {
    const value = values[name].trim()
    if (name !== 'message' && !value) errors[name] = 'required'
    else if (
      (name === 'restaurantName' || name === 'applicantName') &&
      (value.length > 100 || [...value].some((character) => character.charCodeAt(0) < 32))
    )
      errors[name] = 'nameInvalid'
    else if (name === 'email' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254))
      errors[name] = 'emailInvalid'
    else if (
      name === 'phone' &&
      (!/^\+?[0-9 ()\-.]+$/.test(value) ||
        value.replace(/\D/g, '').length < 7 ||
        value.replace(/\D/g, '').length > 15 ||
        value.length > 40)
    )
      errors[name] = 'phoneInvalid'
    else if (name === 'message' && value.length > 1000) errors[name] = 'messageInvalid'
  }
  return errors
}

export function TrialApplication() {
  const { language } = usePreferences()
  const t = trialCopy[language]
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'pending' | 'error' | 'success'>('idle')
  const [failure, setFailure] = useState<'invalid' | 'unavailable' | 'limited'>('unavailable')
  const pending = useRef(false)
  const attempt = useRef<{ key: string; clientId: string } | null>(null)
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const first = Object.keys(errors)[0]
    if (state === 'error' && first)
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }, [state, errors])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (pending.current || state === 'success') return
    const invalid = validate(values)
    setErrors(invalid)
    if (Object.keys(invalid).length) {
      setFailure('invalid')
      setState('error')
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus()
      return
    }
    const normalized = Object.fromEntries(
      fields.map((name) => [name, values[name].trim()]),
    ) as Values
    normalized.email = normalized.email.toLowerCase()
    const key = JSON.stringify(normalized)
    if (!attempt.current || attempt.current.key !== key)
      attempt.current = { key, clientId: crypto.randomUUID() }
    pending.current = true
    setState('pending')
    try {
      const base = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')
      const response = await fetch(`${base}/public/trial-applications`, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...normalized, clientId: attempt.current.clientId }),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.received !== true) {
        if (response.status === 429) setFailure('limited')
        else if (response.status === 400 && result?.fields) {
          const invalid: Errors = {}
          for (const field of fields)
            if (result.fields[field])
              invalid[field] =
                field === 'email'
                  ? 'emailInvalid'
                  : field === 'phone'
                    ? 'phoneInvalid'
                    : field === 'message'
                      ? 'messageInvalid'
                      : 'nameInvalid'
          setErrors(invalid)
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
    <section className="trial-section section-space" id="free-trial" aria-labelledby="trial-title">
      <div className="trial-layout container">
        <div className="trial-copy" data-reveal="rise">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 id="trial-title">{t.title}</h2>
          <p className="section-intro">{t.intro}</p>
          <p className="trial-note">
            <Check size={18} aria-hidden="true" />
            {t.note}
          </p>
        </div>
        <form
          className="trial-form"
          ref={form}
          onSubmit={submit}
          noValidate
          aria-label={t.title}
          aria-busy={state === 'pending'}
        >
          <fieldset disabled={state === 'pending' || state === 'success'}>
            <legend className="sr-only">{t.title}</legend>
            {fields.map((name) => (
              <div
                className={`trial-field ${name === 'message' ? 'trial-field-wide' : ''}`}
                key={name}
              >
                <label htmlFor={`trial-${name}`}>
                  {t[name]}
                  {name === 'message' && <span> ({t.optional})</span>}
                </label>
                {name === 'message' ? (
                  <textarea
                    id={`trial-${name}`}
                    name={name}
                    rows={3}
                    maxLength={1000}
                    value={values[name]}
                    onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `trial-${name}-error` : undefined}
                  />
                ) : (
                  <input
                    id={`trial-${name}`}
                    name={name}
                    type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                    autoComplete={
                      name === 'email'
                        ? 'email'
                        : name === 'phone'
                          ? 'tel'
                          : name === 'applicantName'
                            ? 'name'
                            : 'organization'
                    }
                    dir={name === 'email' || name === 'phone' ? 'ltr' : undefined}
                    required
                    maxLength={name === 'email' ? 254 : name === 'phone' ? 40 : 100}
                    value={values[name]}
                    onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={
                      [
                        name === 'phone' ? 'trial-phone-hint' : '',
                        errors[name] ? `trial-${name}-error` : '',
                      ]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                  />
                )}
                {name === 'phone' && <small id="trial-phone-hint">{t.phoneHint}</small>}
                {errors[name] && (
                  <small className="trial-field-error" id={`trial-${name}-error`}>
                    {t[errors[name]]}
                  </small>
                )}
              </div>
            ))}
            <button className="button trial-submit" type="submit">
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
          <div className="trial-feedback" role="status" aria-live="polite" aria-atomic="true">
            {state === 'success' && (
              <div className="trial-success">
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
      </div>
    </section>
  )
}
