import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = async (pageNum) => {
    const Url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${pageNum}&pageSize=9`;
    
    try {
      const response = await fetch(Url, {
        method: 'GET',
        // Removed the headers property to avoid setting Content-Type unnecessarily
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const parsedData = await response.json();
      setArticles(prevArticles => [...prevArticles, ...(parsedData.articles || [])]);
      setTotalResults(parsedData.totalResults || 0);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };
  

  useEffect(() => {
    fetchNews(page);   // eslint-disable-next-line
  }, [page]);

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  return (
    <>
      <div className="container-fluid align-items-center d-inline-block">
        <h2 className="text-capitalize text-center text-decoration-underline strong card-header heading mb-5 mt-2">
          InfoVista top headlines
        </h2>
        <div className="container">
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length < totalResults}
            loader={<Spinner />}
            scrollableTarget="scrollableDiv"
          >
            <div className="row justify-content-center">
              {articles.map((element, index) => (
                <div className="data col-lg-4 mb-5 col-md-5 col-12" key={index}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 40) : ""}
                    description={element.description ? element.description.slice(0, 80) : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    publishedAt={element.publishedAt ? element.publishedAt.slice(0, 10) : ""}
                  />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default News;
