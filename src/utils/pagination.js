const getPagination = (page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = 10;
  }

  if (limit > 100) {
    limit = 100;
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const getPaginationResponse = ({
  data,
  total,
  page,
  limit,
}) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

module.exports = {
  getPagination,
  getPaginationResponse,
};