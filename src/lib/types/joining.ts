interface JoinParams {
  select?: string;
  hasParams?: boolean;
}

export const parseJoinParams = (url: URL): JoinParams => {
  const selectParam = url.searchParams.get('select');

	const query: JoinParams = {};
  query.hasParams = false;

	if (selectParam !== null) {
		query.select = selectParam;
    query.hasParams = true;
	}

	return query
}

