
import { useState, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type AddProfileModalProps = {
  onNewProfile: (profile: Profile) => void
}

function AddProfileModal({onNewProfile} : AddProfileModalProps) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onCreate = () => {
    onNewProfile({name: name, active: false})
    setOpen(false)
  }

  const onOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <MenuItem key="addProfile" onClick={onOpen}>
        <Typography textAlign="center">Nouveau profil</Typography>
      </MenuItem>    
      <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Options</DialogTitle>
        <DialogContent>
          <TextField label="Nom" value={name} onChange={onNameChange} />          
        </DialogContent>
        <DialogActions>
          <Button onClick={onCreate} disabled={name===""}>Créer</Button>
          <Button onClick={onCancel}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


type Profile = {
  name: string,
  active: boolean
}

type ProfileProps = {
  profiles: Array<Profile>,
  onChange: (profiles: Array<Profile>) => void,
}

function Profiles({profiles, onChange}: ProfileProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNewProfile = (profile: Profile) => {
    const newProfiles = [...profiles];
    newProfiles.push(profile);
    onChange(newProfiles)
  }

  const switchProfile = (name: string) => {
    const newProfiles = profiles.map((x) => {x.active = false; return x;});
    const index = newProfiles.findIndex((x) => x.name===name)
    newProfiles[index].active = true;

    onChange(newProfiles);
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
    <Tooltip title="Open settings">
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
      </IconButton>
    </Tooltip>
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      {profiles.map((profile) => (
        <MenuItem key={profile.name} onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{profile.name}</Typography>
        </MenuItem>
      ))}
      <AddProfileModal onNewProfile={handleNewProfile} />
    </Menu>
  </Box>
  );
}

export type {Profile};
export default Profiles;
