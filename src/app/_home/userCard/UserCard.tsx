/* eslint-disable no-nested-ternary */

'use client';

import React, { FC } from 'react';
import { Avatar, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import RunningText from '@/components/RunningText';
import { experimental_useObject as useObject } from 'ai/react';
import { roastsSchema } from '@/app/api/roasts/schema';
import RadarChartComponent from './RadarChart';
import UserCardViewModel from './UserCard.viewModel';

const UserCard: FC = () => {
  const { session, waktu, arrayText, ref, scaledFeatures } =
    UserCardViewModel();

  const { object, submit } = useObject({
    api: '/api/roasts',
    schema: roastsSchema,
  });

  console.log(object);

  return (
    <>
      <div className='my-5 flex'>
        <RunningText length='100%' overflow='hidden' text={arrayText} />
      </div>
      <div className='flex flex-col items-center justify-center px-4'>
        <Card ref={ref} className='w-full max-w-[1080px] xs:h-fit lg:px-8'>
          <div className='absolute right-[-500px] h-[300px] w-[750px] rotate-[95deg] bg-[#FF0095] blur-[80px]' />
          <div className='absolute bottom-[-500px] left-64 h-[750px] w-[900px] rotate-[-10deg] rounded-[100%] bg-[#8349FF] blur-[80px]' />
          <div className='absolute bottom-[-350px] right-[-200px] h-96 w-[750px] rotate-[-30deg] rounded-[100%] bg-[#FFCDFF] blur-[80px]' />
          <div className='absolute bottom-[-30px] h-48 w-[600px] rotate-0 rounded-[100%] bg-[#0013FF] blur-[80px]' />
          <div className='absolute bottom-[-300px] left-24 h-96 w-96 rotate-90 rounded-[100%] bg-[#00FFFF] blur-3xl' />
          <Image
            src='/pita-rainbow.png'
            alt='rainbow-ribbon'
            height={400}
            width={645}
            className='absolute left-0 top-[-100px] blur-sm'
          />
          <CardHeader className='p-5'>
            <div className='flex items-center justify-center'>
              <Avatar
                src={session?.user?.image ?? ''}
                size='lg'
                className='mr-5 rounded-[100%]'
                isBordered
              />
              <p className='h-fit text-[25px] font-bold ph:text-[30px]'>
                {session?.user?.name}
              </p>
            </div>
          </CardHeader>
          <CardBody className='relative flex max-w-full overflow-hidden'>
            <div className='flex flex-col items-center md:flex-row lg:justify-center'>
              <div className='-order-first flex h-[35%] items-center justify-center p-8 ph:mt-0 ph:h-full ph:p-12 md:order-first md:min-h-[400px] md:max-w-[50%] md:py-0'>
                <Card className='p-5 xs:mb-8 xs:min-w-[232px] ph:min-w-[319px] ph:p-10 md:mb-0 md:min-w-[400px]'>
                  test
                </Card>
              </div>
              <div className='relative flex h-[400px] w-full justify-center md:justify-end lg:px-12'>
                <div className='z-0 flex h-[400px] min-w-full items-center justify-center rounded-3xl bg-white bg-opacity-[10%] backdrop-blur-lg ph:min-w-[319px] lg:max-w-[400px] lg:rounded-l-3xl'>
                  <RadarChartComponent
                    scaledAcousticness={scaledFeatures.acousticness!}
                    scaledDanceability={scaledFeatures.danceability!}
                    scaledEnergy={scaledFeatures.energy!}
                    scaledSpeechiness={scaledFeatures.speechiness!}
                    scaledValence={scaledFeatures.valence!}
                  />
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 flex w-full justify-between xs:mb-2 md:mt-8'>
              <div className='relative flex w-full items-center justify-between'>
                {/* Issue Date */}
                <div className='flex w-96 xs:text-xs ph:text-sm lg:text-xl lg:font-bold'>
                  Issued at{' '}
                  {waktu.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className='mb-3 w-[175px]'>
                  <Image src='/wm-dark.svg' alt='wm' width={175} height={175} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <Button
          radius='sm'
          onClick={() => submit(scaledFeatures)}
          type='button'
          className='mt-5 h-12 w-fit text-xl font-bold xs:px-12 ph:px-4 lg:w-[20%]'
        >
          <p className='text-small ph:text-lg'> Obtain card</p>
        </Button>
      </div>
      <div className='my-5 flex'>
        <RunningText length='100%' overflow='hidden' text={arrayText} />
      </div>
    </>
  );
};

export default UserCard;
