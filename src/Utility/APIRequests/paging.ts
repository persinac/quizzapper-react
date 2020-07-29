import {postServerData} from "./getOrRequestData";
import {IFilterQuery, IPagination, ISort} from "../../State";

export function forwardPage(startIndex: number, batchSize: number, totalCount: number): number {
    if ((startIndex + batchSize) <= totalCount) {
        return startIndex + batchSize;
    } else {
        return startIndex;
    }
}

export function backwardPage(startIndex: number, batchSize: number): number {
    if (startIndex > 0) {
        return startIndex - batchSize;
    } else {
        return startIndex;
    }
}

export function pageThroughTable(endpoint: string, paging: IPagination, sorting: ISort[], filters: IFilterQuery[], newStartIndex: number): Promise<any>  {
    const copyFilter: IFilterQuery[] = [];

    filters.forEach((f: IFilterQuery) => {
        if (typeof f.value !== "undefined" && f.value) {
            copyFilter.push(f);
        }
    });
    paging.startIndex = newStartIndex;
    console.log(filters);
    return postServerData(
        {pagination: paging, sort: sorting, filters: copyFilter},
        endpoint,
        false
        )
}