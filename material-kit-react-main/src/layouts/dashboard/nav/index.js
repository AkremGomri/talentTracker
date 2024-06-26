import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

import localforage from 'localforage';
// mock
import { useDispatch } from 'react-redux';
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';

//
import { navSections, navPermission, navFields } from './config';
import { permissions, actions } from '../../../utils/constants/permissions';
import request from '../../../services/request';
import { setMyProfile } from '../../../redux/features/myProfile';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const [navConfig, setNavConfig] = useState([...navSections]);
  const isDesktop = useResponsive('up', 'lg');
  const [profile, setProfile] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    localforage.getItem('myRole').then((myRole) => {
      myRole.permissions?.forEach((permission) => {
        if (permission.subject === permissions.Role.name && !navConfig.some(el => el.title === 'roles')) {
          // navPermission.permissions = permission.actions;
          setNavConfig([navPermission, ...navConfig]);
        } 
        if (permission.subject === permissions.Field.name && !navConfig.some(el => el.title === 'fields')){
          setNavConfig([navFields, ...navConfig]);
        }
      });
      console.log('myRole: ', myRole);
      console.log("navConfig: ", navConfig);
    });
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, navConfig]); // navConfig shouldn't be there, but it's a workaround for now.

  useEffect(() => {
    async function getData(){
        // Retrieve the profile data from LocalForage
        try{
            // const profiles = await localforage.getItem('profile');
            const data = await request.get(`/api/user/profile/${await localforage.getItem('userId')}`);
            console.log("data: ",data);
            dispatch(setMyProfile(data[0]))
            setProfile(data[0]);
          } catch(e) {
              console.log("error: ",e);
            }
            
            // Fetch the profile data from the backend
          }
          getData();
        }, []);

  const coverPhoto = `${process.env.REACT_APP_API_URL}/images/cover/default.png`;
  const profilePhoto = `${process.env.REACT_APP_API_URL}/images/avatar/default.png`;

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={profilePhoto} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {profile?.firstName? `${profile?.fullName}` : `${profile?.email}`}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {profile.role?.name}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          {/* <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box> */}

          {/* <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button> */}
        </Stack>
      </Box>
    </Scrollbar>
  );


  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
