import {
  Button,
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  Text,
  Tooltip,
  makeStyles,
  tokens,
  type OnNavItemSelectData,
} from '@fluentui/react-components'
import { ChevronLeftRegular, ChevronRightRegular } from '@fluentui/react-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { DashboardIcon, isNavGroup, navTree } from '../routes/routeConfig'

const COLLAPSED_WIDTH = 64
const EXPANDED_WIDTH = 260

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingLeft: tokens.spacingHorizontalM,
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const styles = useStyles()
  const location = useNavigate()
  const currentPath = useLocation().pathname

  function handleNavItemSelect(_: unknown, data: OnNavItemSelectData) {
    if (typeof data.value === 'string' && data.value.startsWith('/')) {
      location(data.value)
    }
  }

  const groups = navTree.filter(isNavGroup)
  const groupValues = groups.map((entry) => entry.value)

  return (
    <NavDrawer
      open
      type="inline"
      selectedValue={currentPath}
      defaultOpenCategories={groupValues}
      onNavItemSelect={handleNavItemSelect}
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH, flexShrink: 0 }}
    >
      <NavDrawerHeader>
        <div className={styles.header}>{!collapsed && <Text weight="semibold">Portal Thu học phí</Text>}</div>
      </NavDrawerHeader>
      <NavDrawerBody>
        <Tooltip content="Tổng quan" relationship="label">
          <NavItem value="/dashboard" icon={<DashboardIcon />}>
            {collapsed ? '' : 'Tổng quan'}
          </NavItem>
        </Tooltip>

        {groups.map((group) => (
          <NavCategory key={group.value} value={group.value}>
            <Tooltip content={group.label} relationship="label">
              <NavCategoryItem icon={<group.icon />}>{collapsed ? '' : group.label}</NavCategoryItem>
            </Tooltip>
            <NavSubItemGroup>
              {group.items.map((item) => (
                <Tooltip key={item.path} content={item.label} relationship="label">
                  <NavSubItem value={item.path}>{collapsed ? '' : item.label}</NavSubItem>
                </Tooltip>
              ))}
            </NavSubItemGroup>
          </NavCategory>
        ))}
      </NavDrawerBody>
      <NavDrawerFooter>
        <div className={styles.footer}>
          <Tooltip content={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'} relationship="label">
            <Button
              appearance="subtle"
              icon={collapsed ? <ChevronRightRegular /> : <ChevronLeftRegular />}
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-pressed={!collapsed}
            />
          </Tooltip>
        </div>
      </NavDrawerFooter>
    </NavDrawer>
  )
}
