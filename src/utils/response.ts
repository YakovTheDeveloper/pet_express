export function SuccessResponse(result: unknown) {
    return {result: result || null, isError: false, detail: null}
}

export function ErrorResponse(detail: unknown) {
    return {result: null, isError: true, detail: JSON.stringify(detail)}
}