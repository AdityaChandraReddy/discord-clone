import { initialProfile } from '@/lib/initial-profile'
import { redirect } from 'next/navigation'
import Initialmodal from '@/components/modals/Initial-modal'
import React from 'react'
import { db } from '@/lib/db';

const SetupPage = async () => {
    const profile = await initialProfile();
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }
    return <Initialmodal />
}

export default SetupPage