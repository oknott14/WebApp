export interface ApiResponse<t> {
    success: boolean,
    content: t,
    status: number,
}