import {postServerData} from "./getOrRequestData";
import {IPagination, ISort} from "../../State";

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

export function pageThroughTable(endpoint: string, paging: IPagination, sorting: ISort[], newStartIndex: number): Promise<any>  {
    paging.startIndex = newStartIndex;
    return postServerData(
        {pagination: paging, sort: sorting},
        endpoint,
        false
        )
}