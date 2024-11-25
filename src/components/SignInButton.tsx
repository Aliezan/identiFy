'use client';

import React, { FC } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { toast } from 'sonner';

const SignInButton: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const signInHandler = async (): Promise<void> => {
    try {
      const res = await signIn('spotify', { callbackUrl });

      if (!res?.error) {
        router.push(callbackUrl);
      }

      if (res?.error) {
        toast.error('An error occurred during sign-in');
        console.log('An error occured during sign-in', res.error);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error('Unexpected error occurred during sign-in');
        console.error('Unexpected error occured during sign-in', err.message);
      }
    }
  };

  return (
    <Button
      onClick={signInHandler}
      className='z-10 font-bold'
      size='lg'
      radius='sm'
    >
      {' '}
      <Image
        src='https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg'
        alt='spotify-icon'
        width={30}
        height={30}
      />
      <p className='sm:text-md text-sm'>Sign in with Spotify</p>
    </Button>
  );
};

export default SignInButton;
