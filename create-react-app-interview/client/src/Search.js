import React from "react";

const Search = ({searchQuery}) => {
  return (
     <div>
       <input 
        onChange={searchQuery}>
       </input>
    </div>
  )
}

export default Search;