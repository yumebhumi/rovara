export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginationState = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;

export function resolvePagination(input: PaginationInput = {}): PaginationState {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE));

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function toPaginatedResult<T>(
  items: T[],
  total: number,
  state: Pick<PaginationState, "page" | "pageSize">
): PaginatedResult<T> {
  return {
    items,
    total,
    page: state.page,
    pageSize: state.pageSize,
    pageCount: Math.max(1, Math.ceil(total / state.pageSize))
  };
}
