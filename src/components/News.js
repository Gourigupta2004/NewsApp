import React, { Component } from 'react'
import NewsItem from './NewsItem'

export class News extends Component {
 
  constructor() {
    super();
    console.log("Hello I am a constructor from News component");
    this.state = {
      articles: [],
      loading: false
    }
  }

  async componentDidMount(){
    console.log("cdm"); 
    let url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=1340ff27631c4c28a85935146b22e506"; 
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({articles: parsedData.articles})
    
  }

  render() {
    console.log("render");
    return (
      <div>
        <div className="container my-3">
          <h2>NewsMonkey - Top Headlines</h2>
          <div className="row">
          {this.state.articles.map((element)=>{

           return <div className="col-md-4" key={element.url}>
              <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url}/>
            </div>

          })}
          </div>

        </div>
      </div>
    )
  }
}

export default News
