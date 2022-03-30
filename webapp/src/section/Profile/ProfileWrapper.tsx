import { ReactElement, useState } from 'react';
import Profile from './Profile';

const ProfileWrapper = (): ReactElement => {
  const [userUpdated, setUserUpdated] = useState(false);

  return <Profile setUserUpdated={setUserUpdated} />;
};

export default ProfileWrapper;
