import React from 'react';
import Skeleton from 'react-loading-skeleton';

const Loader = () => {
  return (
    <div className='my-10 mx-4 md:mx-56 grid grid-cols-1 md:grid-cols-2 gap-7'>
      <Skeleton width={400} height={200} />
      <div className="flex flex-col justify-center">
        <Skeleton height={30} />
        <Skeleton height={20} width={200} />
      </div>
    </div>
  );
};

export default Loader;
