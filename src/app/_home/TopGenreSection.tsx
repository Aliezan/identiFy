import React, { FC } from 'react';
import TopGenre from './topGenreCard/TopGenre';

const TopGenreSection: FC = () => (
  <section className='h-[400px] flex justify-center items-center mb-10'>
    <div>
      <h1 className='mb-4 font-bold text-3xl'>Your Top Genres</h1>
      <TopGenre />
    </div>
  </section>
);

export default TopGenreSection;
