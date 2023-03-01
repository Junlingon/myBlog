import React from 'react'
import { useRouter } from 'next/router'
import { PersonalWidget, PostDetail } from '../../components'

const PostPage = () => {
    const router = useRouter()

    if (router.isFallback) {
        return <div className='flex justify-center items-center text-xl font-semibold'>Loading......</div>
    }

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <PostDetail post={{ e: "1" }} />
                </div>
                <div className="col-span-1 lg:col-span-4">
                    <div className="relative lg:sticky top-8">
                        <PersonalWidget />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostPage