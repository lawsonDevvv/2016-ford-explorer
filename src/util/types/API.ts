export interface ApiGenericResponse {
    message: string
}

export interface ApiGetRankByUsernameSuccessResponse {
    username: string;
    rank: number;
}

export interface ApiMemberPlusCheckSuccessResponse {
    ownsGamePass: true
}