import React from "react";

const returnFavoriteString = (favorites) => {
  if(favorites["favorites"].length === 0)
    return;
  else if(favorites["favorites"].length === 1)
    return favorites["favorites"][0];
  else if(favorites["favorites"].length === 2)
    return favorites["favorites"][0] + " and " + favorites["favorites"][1];
  else 
    return favorites["favorites"][0] + " and " + favorites["favorites"][1] + " and "+ (favorites["favorites"].length-2)+" other(s)";
}

const Favorites = (favorites) => {

  return (
    <div>
       {returnFavoriteString(favorites)}
    </div>
  )
}

export default Favorites;