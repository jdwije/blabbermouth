const emit: Blabbermouth.Publisher = async (topicId, content, distributor) => {
  return { topicId, content, distributor };
};

export default emit;
