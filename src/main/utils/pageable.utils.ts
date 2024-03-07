interface GetPageAndLimitInput {
  query: {
    page: number;
    limit: number;
  };
}

interface GetPageAndLimitOutput {
  skip: number;
  take: number;
}

export const getPageAndLimit = ({ query }: GetPageAndLimitInput): GetPageAndLimitOutput => {
  const page = Number(query.page);
  const limit = Number(query.limit);
  const subtractPage = 1;

  const skip = (page - subtractPage) * limit;
  const take = limit;

  return { skip, take };
};
