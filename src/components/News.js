import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const { country, category, pageSize, setProgress, apiKey } = props;

  //character limit for news items

  const characterLimit = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // ✅ Runs only once when the component mounts
  // ✅ Fetches news articles based on category, country, and page size
  // ✅ Sets the document title to reflect the current category
  useEffect(() => {
    const updateNews = async () => {
      try {
        setProgress(10);
        const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&q=${category}&size=${pageSize}&language=en`;

        setLoading(true);
        let data = await fetch(url);
        setProgress(30);
        let parsedData = await data.json();
        setProgress(70);
        if (Array.isArray(parsedData.results)) {
          setArticles(parsedData.results);
        } else {
          console.error("Unexpected data format:", parsedData);
          setArticles([]);
        }
        setTotalResults(parsedData.totalResults);
        setPage(parsedData.nextPage); // ✅ reset scroll page
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]);
      }

      setLoading(false);
      setProgress(100);
    };

    updateNews();

    document.title = `NewsMonkey - ${capitalizeFirstLetter(
      category
    )} Headlines`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Runs only when `page` changes and it's not first load

  const fetchMoreData = async () => {
    if (page !== null) {
      const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&q=${category}&size=${pageSize}&language=en&page=${page}`;
      setLoading(true);
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles((prevArticles) => prevArticles.concat(parsedData.results));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setPage(parsedData.nextPage); // ✅ update scroll page for next fetch
    }
  };

  console.log("render");

  return (
    <div>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={loading && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {Array.isArray(articles) &&
              articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.article_id}>
                    <NewsItem
                      title={
                        element.title ? characterLimit(element.title, 88) : ""
                      }
                      description={
                        element.description
                          ? characterLimit(element.description, 180)
                          : ""
                      }
                      imageUrl={element.image_url}
                      newsUrl={element.link}
                      author={
                        Array.isArray(element.creator)
                          ? element.creator[0]
                          : "Unknown"
                      }
                      date={element.pubDate}
                      source={element.source_name}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
