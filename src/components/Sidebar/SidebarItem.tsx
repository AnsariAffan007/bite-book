import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'

const SidebarItem = ({ icon, iconColor, text, route, onClick }: any) => {

  return (
    <Link href={route} style={{ textDecoration: "none", color: "inherit" }}>
      <ListItem disablePadding onClick={() => onClick?.()}>
        <ListItemButton>
          <ListItemIcon sx={{ minWidth: "35px", color: iconColor }}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </Link>
  )
}

export default SidebarItem