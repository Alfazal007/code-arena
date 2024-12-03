import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utils/apiErrors";
import { relogin } from "../../../../../responseStrings/responseStrings";
import { ApiResponse } from "../../../../../../utils/apiResponse";

export async function GET(request: NextRequest) {
    const userHeader = request.headers.get('x-user');
    const currentUser = userHeader ? JSON.parse(userHeader) : null;
    if (!currentUser) {
        return NextResponse.json(new ApiError(401, relogin, [], []), { status: 401 })
    }
    return NextResponse.json(new ApiResponse(200, "", currentUser), { status: 200 })
}
