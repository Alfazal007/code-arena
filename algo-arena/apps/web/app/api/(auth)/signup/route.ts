import prisma from "@repo/database/client";

export async function POST(request: Request) {
    try {
        const users = await prisma.user.findFirst({
            where: {
                id: "123"
            }
        });
        console.log("worked")
        console.log({ users })
    } catch (err) {
        console.log("error did not work")
        console.log(err)
    }
    return Response.json({
        message: "hello world"
    })
}
