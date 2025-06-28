import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const { country, category, apiKey, pageSize, setProgress } = props;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // ✅ Run only on component mount or when props change (not page)
  useEffect(() => {
    const updateNews = async () => {
      setProgress(10);
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=1&pageSize=${pageSize}`;
      setLoading(true);
      let data = await fetch(url);
      setProgress(30);
      let parsedData = await data.json();
      setProgress(70);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setInitialLoadDone(true);
      setProgress(100);
      setPage(1); // ✅ reset scroll page
    };

    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Runs only when `page` changes and it's not first load
  useEffect(() => {
    if (!initialLoadDone || page === 1) return;

    const fetchMoreNews = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
      setLoading(true);
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
    };

    fetchMoreNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); 

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  console.log("render");

    return (
      <div>
          <h1 className="text-center" style={{ margin: '35px 0px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
          {loading && <Spinner/>}
          <InfiniteScroll
            dataLength={articles.length}
            next = {fetchMoreData}
            hasMore = {articles.length < totalResults}
            loader = {loading && <Spinner/>}
            >

            <div className="container">

            <div className="row">
              {articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>

          })}
            </div>
          </div>
          </InfiniteScroll>
      </div>
    )
  }

  News.defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'general',

  }

  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

export default News
