/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import poster from './img/The_Marvel_Universe.webp';
import logo from './img/Marvel_Logo.svg.png';
import './App.css';

function App() {

  const [list,setList] = useState([]); //list çekilecek veriler için
  const [isLoading,setLoading] = useState(true); //karakterler çekilene kadar true, çekilince false 
  const[pageNumber,setPageNumber] = useState(1);
  const [offset, setOffset] = useState(0);

  const hash = '58de91059e56c4deb6c7fa72712c4284';

  const pageNumbers=[];
  for(let i=1;i<Math.ceil(150/20);i++){
    pageNumbers.push(i);
  }

  const sessionData = JSON.parse(sessionStorage.getItem('marvelCharacter')) || [];

  const fetch= async() => {  
    setLoading(true);
    const result = await axios.get(`http://gateway.marvel.com/v1/public/characters?ts=1&limit=20&offset=${offset*20}&apikey=364a8f7d4a03a38e6d39d3ae9189063b&hash=${hash}`).then((res) => {
      setList(res.data.data.results);
      sessionStorage.setItem('marvelCharacter', JSON.stringify({...sessionData, [pageNumber]: [...res.data.data.results]}));
    });
    setLoading(false);
  };

  useEffect(()=> {
    if(sessionData[pageNumber]){
      setList(sessionData[pageNumber]);
    }else {
      fetch();
    }
  },[offset]);


  const paginated = (pageNumber) => {
    setPageNumber(pageNumber); 
    setOffset(x => pageNumber-1);
  };

  return (
    <div className="App">
      <header>
        <img className='header-background' src={poster} />
        <img className='header-image' src={logo} />
      </header>

      <div className="container">
        <div className="row">
          {
            list.map((item,index) => 

              <div className="rows" key={index}>
                <div className='thumbnail'>

                  <div className='card-top'>
                    <img src={`${item.thumbnail.path}.${item.thumbnail.extension}`} alt="" />
                  </div>
                  <div className="card-bottom">
                    <h5>{item.name}</h5>
                  </div>
                </div>
              </div>
            )
        
          }
        </div>
        <div className="pagination ">
          <ul style={{listStyle:'none'}} className='pagination_section'>
            <li className="page-item">
              <a onClick={()=> paginated(pageNumber-1)} href='!#' className='page-link'>
                &lt;
              </a>
            </li>
            {pageNumbers.map(number=> (
              <li key={number} className="page-item">
                <a onClick={(e)=> paginated(Number(e.target.innerText))} href='!#' className='page-link'>
                  {number}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a onClick={()=> paginated(pageNumber + 1)} href='!#' className='page-link'>
                &gt;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
