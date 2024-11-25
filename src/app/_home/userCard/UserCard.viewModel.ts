import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import useGetTopTracks from '@/server/topTracks/queries';
import useAudioFeatures from '@/server/audioFeatures/queries';
import calculateAverage, { AudioFeature } from '@/utils/calculateAverage';
import roastsSchema from '@/actions/schema';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { generateRoastRSC, RequestType } from '@/actions/actions';
import { readStreamableValue } from 'ai/rsc';
import useGetTopArtists from '@/server/topArtists/queries';

const UserCardViewModel = () => {
  const { data: session } = useSession();

  const [waktu, setWaktu] = useState<Date | null>(null);

  useEffect(() => {
    setWaktu(new Date());
  }, []);

  const { data: TopTracks } = useGetTopTracks(
    session?.accessToken ?? '',
    'long_term',
    '50',
  );

  const trackIds = TopTracks?.map((track) => track.id).join(',');

  const { data: AudioFeaturesData } = useAudioFeatures(
    session?.accessToken ?? '',
    trackIds ?? '',
  );

  const features: AudioFeature[] = [
    'valence',
    'danceability',
    'energy',
    'acousticness',
    'speechiness',
  ];

  const averages = features.reduce(
    (acc, feature) => {
      acc[feature] = calculateAverage(AudioFeaturesData, feature);
      return acc;
    },
    {} as Record<AudioFeature, number>,
  );

  const scaledFeatures = Object.fromEntries(
    Object.entries(averages).map(([key, value]) => [
      key,
      Math.round(value * 100),
    ]),
  );

  const { data: topArtists } = useGetTopArtists(
    session?.accessToken ?? '',
    'medium_term',
    '50',
  );
  const topGenres = topArtists?.map((artist) => artist.genres);

  const genreCounts: Record<string, number> = {};

  topGenres?.forEach((genreArray) => {
    genreArray.forEach((genre) => {
      if (genre in genreCounts) {
        genreCounts[genre]! += 1;
      } else {
        genreCounts[genre] = 1;
      }
    });
  });

  const genreCountPairs = Object.entries(genreCounts);

  genreCountPairs.sort((a, b) => b[1] - a[1]);

  const sortedGenres = genreCountPairs.map((pair) => pair[0]);

  const topGenre = sortedGenres[0];

  type RoastSchemaType = z.infer<typeof roastsSchema>;
  const [generation, setGeneration] = useState<RoastSchemaType | null>(null);
  const [isLoadingRoast, setIsLoadingRoast] = useState(false);
  const CACHE_KEY = 'roastCache';

  const roastStream = async () => {
    try {
      setIsLoadingRoast(true);
      // Check if there's cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Use the cached data to set the initial state
        setGeneration(parsedData as RoastSchemaType);
      }

      // Fetch fresh data
      const { object } = await generateRoastRSC(
        scaledFeatures as RequestType,
        topGenre!,
      );

      let partialObject: RoastSchemaType | null = null;
      for await (const obj of readStreamableValue(object)) {
        if (obj) {
          setIsLoadingRoast(false);
          partialObject = obj;
        }

        if (partialObject) {
          setGeneration(partialObject);
          // Cache the new data in localStorage
          localStorage.setItem(CACHE_KEY, JSON.stringify(partialObject));
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected error:', err.message);
        toast.error('Unexpected error occurred');
      } else {
        console.error('An unknown error occurred', err);
        toast.error('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setGeneration(parsedData as RoastSchemaType);
    }
  }, []);

  const arrayText = Array(40).fill(`${session?.user?.name}`).join(' ');

  return {
    session,
    waktu,
    arrayText,
    roastStream,
    generation,
    scaledFeatures,
    topGenre,
    isLoadingRoast,
  };
};

export default UserCardViewModel;
