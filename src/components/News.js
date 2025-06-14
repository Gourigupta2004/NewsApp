import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';

export class News extends Component {

  constructor() {
    super();
    console.log("Hello I am a constructor from News component");
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
  }

  async updateNews(){
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1340ff27631c4c28a85935146b22e506&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true}); 
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({ articles: parsedData.articles, 
    totalResults: parsedData.totalResults,
    loading : false })
  }

  async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1340ff27631c4c28a85935146b22e506&page=1&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true}); 
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
    // this.setState({ articles: parsedData.articles, 
    // totalResults: parsedData.totalResults,
    // loading : false })

    this.updateNews(); 
  }

  //We can directly write arrow functions for previous & next button in their respective html element
  
  handlePrevClick = async () => {
    // console.log("Previous");
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1340ff27631c4c28a85935146b22e506&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;

    // this.setState({loading: true}); 

    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);

    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles, 
    //   loading: false
    // })

        this.setState({page: this.state.page-1});
        this.updateNews();


  }

  handleNextClick = async () => {

    // if (!(this.state.page+1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {

    //   console.log("Next");
    //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1340ff27631c4c28a85935146b22e506&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;

    //   this.setState({loading: true}); 

    //   let data = await fetch(url);
    //   let parsedData = await data.json();
    //   console.log(parsedData);

    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles, 
    //     loading: false
    //   })
    // }

    this.setState({page: this.state.page+1});
    this.updateNews();
  }


  render() {
    console.log("render");
    return (
      <div>
        <div className="container my-3">
          <h1 className="text-center" style={{margin: '35px 0px'}}>NewsMonkey - Top Headlines</h1>
            {this.state.loading && <Spinner/>}
          <div className="row">
            {!this.state.loading && this.state.articles.map((element) => { 
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>

            })}
          </div>
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
