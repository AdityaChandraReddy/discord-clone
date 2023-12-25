import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function DELETE(req:Request,{params}:{params:{memberId:string}}) {
    try{

        const profile  = await currentProfile();
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if(!serverId){
            return new NextResponse("Server Id missing",{status:401})
        }
        if(!params.memberId){
            return new NextResponse("Member Id is missing",{status:401})
        }
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    deleteMany:{
                        id:params.memberId,
                        profileId:{
                            not:profile.id
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }

        })
        return NextResponse.json(server)

    }
    catch(e){
        console.log("[DELETE MEMBER ID]",e)
        return new NextResponse("Internal Error",{status:500})
    }
    
}

export async function PATCH(req:Request,{params}:{params:{memberId:string}}) {
    try{
        console.log("INT THE TRY BLOCK")
        const profile  = await currentProfile();
        const {searchParams} = new URL(req.url)
        const {role} = await req.json()
        const serverId = searchParams.get("serverId")
        if(!serverId){
            return new NextResponse("Server Id missing",{status:401})
        }
        if(!params.memberId){
            return new NextResponse("Member Id is missing",{status:401})
        }
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }

        })
        return NextResponse.json(server)
    }
    catch(e){
        console.log("[MEMBER ID PATCH]",e)
        return new NextResponse("Internal Error",{status:500})
    }
}