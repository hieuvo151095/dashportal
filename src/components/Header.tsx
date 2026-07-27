import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Hamburger,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { AlertRegular, PersonRegular, SettingsRegular, SignOutRegular } from '@fluentui/react-icons'
import { Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBreadcrumbTrail } from '../routes/routeConfig'
import { logout } from '../utils/auth'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    flexShrink: 0,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  bellWrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  bellBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    pointerEvents: 'none',
  },
  avatarButton: {
    minWidth: 0,
    padding: 0,
  },
})

const THONG_BAO_MAU = [
  'Trường THCS Trần Phú vừa cập nhật công nợ tháng 07/2026.',
  '128 hoá đơn mới được gửi trong hôm nay.',
  'Có 5 trường chưa cập nhật danh mục phí niên khoá 2025-2026.',
]

interface HeaderProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Header({ collapsed, onToggleCollapse }: HeaderProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const trail = getBreadcrumbTrail(useLocation().pathname)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <Hamburger onClick={onToggleCollapse} aria-label="Thu gọn/mở rộng sidebar" aria-pressed={!collapsed} />
        <Breadcrumb>
          {trail.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.path && index < trail.length - 1 ? (
                  <BreadcrumbButton onClick={() => navigate(item.path!)}>{item.label}</BreadcrumbButton>
                ) : (
                  <BreadcrumbButton current>{item.label}</BreadcrumbButton>
                )}
              </BreadcrumbItem>
              {index < trail.length - 1 && <BreadcrumbDivider />}
            </Fragment>
          ))}
        </Breadcrumb>
      </div>

      <div className={styles.right}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <div className={styles.bellWrapper}>
              <Button appearance="subtle" icon={<AlertRegular />} aria-label="Thông báo" />
              <Badge className={styles.bellBadge} appearance="filled" color="danger" size="small">
                {THONG_BAO_MAU.length}
              </Badge>
            </div>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {THONG_BAO_MAU.map((text) => (
                <MenuItem key={text}>{text}</MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" className={styles.avatarButton}>
              <Avatar name="Lãnh đạo Sở GD&ĐT" color="colorful" />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<PersonRegular />}>Hồ sơ</MenuItem>
              <MenuItem icon={<SettingsRegular />}>Cài đặt</MenuItem>
              <MenuDivider />
              <MenuItem icon={<SignOutRegular />} onClick={handleLogout}>
                Đăng xuất
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  )
}
