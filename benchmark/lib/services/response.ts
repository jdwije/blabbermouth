/**
 * Builds up a http response.
 */
const response = (limit) => {
  const res = {
    sequenceLimit: limit,
    data: [],
    type: 'http.response',
  };

  return async (event, bm) => {
    const data = event.content.data;

    res.data.push(data);

    if (res.data.length === limit) {
      await bm.publish('http.response', res);
    }

    return data;
  };
};

export default response;
