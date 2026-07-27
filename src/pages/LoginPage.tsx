import {
  Body1,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Link,
  Spinner,
  Subtitle2,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { EyeOffRegular, EyeRegular, LockClosedRegular, MailRegular } from '@fluentui/react-icons'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAuthenticated, login } from '../utils/auth'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    backgroundImage: `linear-gradient(160deg, ${tokens.colorBrandBackground2} 0%, ${tokens.colorNeutralBackground3} 60%)`,
    padding: tokens.spacingHorizontalXL,
  },
  card: {
    width: '380px',
    maxWidth: '100%',
    padding: tokens.spacingHorizontalXL,
    rowGap: tokens.spacingVerticalM,
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalS,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  optionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const styles = useStyles()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const nextEmailError = !email
      ? 'Vui lòng nhập email'
      : !EMAIL_REGEX.test(email)
        ? 'Email không hợp lệ'
        : undefined
    const nextPasswordError = !password ? 'Vui lòng nhập mật khẩu' : undefined

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setLoading(true)
    setTimeout(() => {
      login()
      navigate('/dashboard', { replace: true })
    }, 800)
  }

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <div className={styles.logo}>
          <Subtitle2>Sở GD&ĐT</Subtitle2>
          <Title2>Trung tâm Điều hành Tài chính Học đường</Title2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field label="Email" validationState={emailError ? 'error' : 'none'} validationMessage={emailError}>
            <Input
              type="email"
              value={email}
              onChange={(_, data) => setEmail(data.value)}
              contentBefore={<MailRegular />}
              placeholder="ten@sogddt.hochiminhcity.gov.vn"
            />
          </Field>

          <Field
            label="Mật khẩu"
            validationState={passwordError ? 'error' : 'none'}
            validationMessage={passwordError}
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(_, data) => setPassword(data.value)}
              contentBefore={<LockClosedRegular />}
              contentAfter={
                <Button
                  appearance="transparent"
                  size="small"
                  icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                />
              }
              placeholder="Nhập mật khẩu"
            />
          </Field>

          <div className={styles.optionsRow}>
            <Checkbox
              checked={rememberMe}
              onChange={(_, data) => setRememberMe(data.checked === true)}
              label="Ghi nhớ đăng nhập"
            />
            <Link href="#">Quên mật khẩu?</Link>
          </div>

          <Button
            type="submit"
            appearance="primary"
            disabled={loading}
            icon={loading ? <Spinner size="tiny" /> : undefined}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <Body1 as="p">Dùng bất kỳ email/mật khẩu hợp lệ nào để đăng nhập (bản demo).</Body1>
      </Card>
    </div>
  )
}
