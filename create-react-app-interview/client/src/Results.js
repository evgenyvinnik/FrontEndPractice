import React from "react";
import Result from "./Result"

const Results = ({results, addFavorite}) => {
  return (
    results.map(result => 
      <Result 
        fetchResult={result}
        addFavorite={addFavorite}
      />
    )
  )
}

export default Results;