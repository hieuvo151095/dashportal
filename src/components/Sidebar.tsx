import {
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
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
})

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
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
    </NavDrawer>
  )
}
