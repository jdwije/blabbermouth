/**
 * Builds up a http response.
 */
const response = (bm, limit) => {
  const res = {
    sequenceLimit: limit,
    data: [],
    type: 'http.response',
  };

  return async (topicId, event) => {
    const data = event.content.data;

    res.data.push(data);

    if (res.data.length === limit) {
      topicId && await bm.publish('http.response', res);
    }

    return data;
  };
};

export default response;
