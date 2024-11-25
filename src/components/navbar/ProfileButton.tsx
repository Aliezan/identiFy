import React, { FC } from 'react';
import { Avatar } from '@nextui-org/react';
import { Session } from 'next-auth';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SignOut from './SignOut';

interface ProfileButtonProps {
  session: Session;
}

const ProfileButton: FC<ProfileButtonProps> = ({ session }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant='ghost'
        size='default'
        className='gap-4'
        data-testid='dropdown-button'
      >
        <Avatar
          src={session?.user?.image ?? ''}
          size='sm'
          isBordered
          color='success'
          data-testid='profile-pic'
        />
        <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel data-testid='user-name'>
        {session?.user?.name}
      </DropdownMenuLabel>
      <DropdownMenuLabel
        data-testid='user-email'
        className='text-tiny font-normal'
      >
        {session?.user?.email}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <SignOut />
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ProfileButton;
