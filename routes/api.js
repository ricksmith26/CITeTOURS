import React from 'react';

import superagent from 'superagent';

export const getLocations = async (lat, long, dist) => {
  const result = superagent
    .get(
      `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${dist}&gscoord=${lat}|${long}&format=json`
    )
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });

  return result;
};
