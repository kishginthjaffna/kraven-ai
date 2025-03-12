import { NextResponse } from "next/server"

export async function POST(request: Request) {
    console.log("Webhook is working: ", request);

    try {
        const body = await request.json()
        console.log("Webhook is working fine!", body);

        return NextResponse.json({success:true}, {status:201}) 
    } catch (error) {
        console.log('Webhook error: ',error);
        return new NextResponse("Internal Server Error in webhook: ", { status: 500 })
    }
}