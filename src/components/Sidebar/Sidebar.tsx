import { getGeneralList, getUserList } from '@/data/Menu'
import { LocalDiningRounded } from '@mui/icons-material'
import { Box, Divider, Drawer, List, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import SidebarItem from './SidebarItem'
import { theme } from '@/themes/theme'
import { useAppContext } from '@/contexts/AppContext'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'

const sidebarBackgroundColor = theme.palette.primary.main;
const sidebarTextColor = "#fff";

const Sidebar = ({ open, toggleDrawer }: any) => {

  const { auth: { auth, setAuth } } = useAppContext()
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get('/api/auth/check');
        setAuth(res?.data?.data)
      }
      catch (e) {
        console.log("Error checking auth!: ", e)
      }
    }
    checkAuth()
  }, [])

  const logout = useCallback(async () => {
    try {
      const res = await axios.post('/api/auth/logout', {})
      enqueueSnackbar(res?.data?.message || 'Logout successful!', { variant: 'success' })
      setAuth({})
      if (location.pathname.includes('profile')) {
        window.location.pathname = '/'
      }
    }
    catch (e) {
      console.log("Error logging out: ", e)
      enqueueSnackbar(
        e?.response?.data?.message || "Logout failed. Please contact admin",
        { variant: 'error' }
      )
    }
  }, [setAuth])

  return (
    <Drawer elevation={0} open={open} anchor="right" onClose={() => toggleDrawer(false)}>
      <Box
        role="presentation"
        display="flex"
        flexDirection="column"
        sx={{ width: 250, height: "100%", backgroundColor: sidebarBackgroundColor, color: sidebarTextColor }}
        onClick={() => toggleDrawer(false)}
      >
        <Box display="flex" alignItems="center" padding="16px" columnGap={1}>
          <LocalDiningRounded sx={{ fontSize: "1.2rem", color: sidebarTextColor }} />
          <Typography sx={{ fontWeight: "bold", color: sidebarTextColor }}>BiteBook</Typography>
        </Box>
        <Divider />
        <List>
          {getGeneralList().map(option => (
            <SidebarItem
              key={option.id}
              icon={option.icon}
              iconColor={sidebarTextColor}
              text={option.text}
              route={option.route}
            />
          ))}
        </List>

        <Divider style={{ marginTop: "auto" }} />
        <List>
          {getUserList((Boolean(auth?.username) && Boolean(auth?.email))).map(option => (
            <SidebarItem
              key={option.id}
              icon={option.icon}
              iconColor={sidebarTextColor}
              text={option.text}
              route={option.route}
              onClick={option.text === 'Logout' ? logout : null}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar