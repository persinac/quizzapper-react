const ax = require('axios').default;
export function postServerData(body: any, endpoint: string, put: boolean): Promise<any> {
    console.log(`${process.env.REACT_APP_BASE_API_URL}${endpoint}`);
    console.log(body);
    return ax.post(`${process.env.REACT_APP_BASE_API_URL}${endpoint}`, {
        ...body
    });
}

export function getServerData(builtURI: string): Promise<any> {
    console.log(builtURI);
    return ax.get(builtURI);
}
