import React from 'react'
import { useIdentityContext, User } from 'react-netlify-identity'
import useLoading from '../useLoading'
import VisuallyHidden from '@reach/visually-hidden'

type LoginProps = {
  onLogin?: (user?: User) => void
}

export function Login({ onLogin }: LoginProps) {
  const { loginUser } = useIdentityContext()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [msg, setMsg] = React.useState('')
  const [isLoading, load] = useLoading()
  return (
    <form
      ref={formRef}
      className="form"
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & { email: { value: string }; password: { value: string } }
        const email = target.email.value
        const password = target.password.value
        load(loginUser(email, password, true))
          .then((user) => {
            if (process.env.NODE_ENV !== 'production') console.log('Success! Logged in', user)
            if (onLogin) onLogin(user)
          })
          .catch((err) => void console.error(err) || setMsg('Error: ' + err.message))
      }}
    >
      <div className="RNIW_formGroup" key="email">
        <label>
          <VisuallyHidden>Enter your email</VisuallyHidden>
          <input
            className="RNIW_formControl"
            type="email"
            name="email"
            placeholder="Email"
            autoCapitalize="off"
            required={true}
          />
          <div className="RNIW_inputFieldIcon RNIW_inputFieldEmail" />
        </label>
      </div>
      <div className="RNIW_formGroup" key="password">
        <label>
          <VisuallyHidden>Enter your password</VisuallyHidden>
          <input className="RNIW_formControl" type="password" name="password" placeholder="Password" required={true} />
          <div className="RNIW_inputFieldIcon RNIW_inputFieldPassword" />
        </label>
      </div>

      <div>
        <button type="submit" className={isLoading ? 'RNIW_btn RNIW_saving' : 'RNIW_btn'}>
          Login
        </button>
        {msg && <pre style={{ background: 'salmon', padding: 10 }}>{msg}</pre>}
      </div>
      <button type="button" className="RNIW_btnLink forgotPasswordLink">
        Forgot password?
      </button>
    </form>
  )
}
