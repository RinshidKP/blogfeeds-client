import { useEffect, useState, useCallback } from 'react';
import './App.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { formatUnixTimestamp } from './utils/dateUtils'
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from './components/Loader';
import EndMessage from './components/EndMessage';
import ScrollButton from './components/ScrollButton';
import Header from './components/Header';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false);
    }
    window.addEventListener('scroll', handleScrollButtonVisibility);
    return () => {
      window.removeEventListener('scroll', handleScrollButtonVisibility)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos;
      setIsHeaderVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchData = useCallback(async (pageNumber) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/photo-gallery-feed-page/${pageNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const newData = response.data.nodes;
      if (newData.length === 0) {
        setHasMore(false)
        return
      }
      setData(prevData => [...prevData, ...newData]);
      console.log(response.data.nodes[0]);
      console.log(newData)
      setPage(pageNumber + 1);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const fetchMoreData = () => {
    fetchData(page);
  };

  return (
    <div>
      {isHeaderVisible && <Header />}
      {error && <div className="text-red-500">{error}</div>} 
      <div className='flex mt-20 justify-center items-center min-h-screen max-w-screen'>
        {showButton && <ScrollButton onClick={handleScrollToTop} />}
        <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={<EndMessage />}
        >
          {
            loading ? (
              // Skeleton loader while data is being fetched
              <div className='my-10 mx-4 md:mx-56 grid grid-cols-1 md:grid-cols-2 gap-7'>
                <Skeleton width={400} height={200} />
                <div className="flex flex-col justify-center">
                  <Skeleton height={30} />
                  <Skeleton height={20} width={200} />
                </div>
                <Skeleton width={400} height={200} />
                <div className="flex flex-col justify-center">
                  <Skeleton height={30} />
                  <Skeleton height={20} width={200} />
                </div>
                <Skeleton width={400} height={200} />
                <div className="flex flex-col justify-center">
                  <Skeleton height={30} />
                  <Skeleton height={20} width={200} />
                </div>
              </div>
            ) : (
              // Actual data
              data.map((blog, index) => (
                <div className='my-10 mx-4 md:mx-56 grid grid-cols-1 md:grid-cols-2 gap-7' key={index}>
                  <div>
                    <img src={blog.node.ImageStyle_thumbnail || ''} loading="lazy" alt="" className="w-full h-full object-cover rounded-3xl max-h-400" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <h1 className="text-lg md:text-xl lg:text-2xl line-clamp-3">{blog.node.title || ''}</h1>
                    <h1 className=" text-sm text-gray-500 font-semibold md:text-base lg:text-lg">{formatUnixTimestamp(blog.node.last_update) || ''}</h1>
                  </div>
                </div>
              ))
            )
          }
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default App;
