export type PaginatedResponse<T> = {
  data: T[];

  // pageSize is the number of items in the current page
  pageSize: number;
  // next is the cursor to the next page of data
  next?: number;
  // total is the total number of items in the collection
  total: number;
};
