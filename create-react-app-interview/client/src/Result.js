import React from "react";

const Result = ({fetchResult, addFavorite}) => {
  return (
    <div id={fetchResult.id}>
      <div>
        {fetchResult.name}
      </div>
      <div>
        {fetchResult.jobTitle}
      </div>

      <button onClick={() => addFavorite(fetchResult)}>
        +
      </button>
    </div>
  )
}

export default Result;