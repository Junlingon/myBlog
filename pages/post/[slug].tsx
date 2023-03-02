import React from 'react'
import { useRouter } from 'next/router'
import { PersonalWidget, PostDetail } from '../../components'

const PostPage = () => {
    const router = useRouter()

    if (router.isFallback) {
        return <div className='flex justify-center items-center text-xl font-semibold text-white'>Loading......</div>
    }

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-12">
                <div className="lg:col-start-2 lg:col-span-10 col-span-1">
                    <PostDetail post={{ e: "1" }} />
                </div>
                {/* <div className="col-span-1 lg:col-span-4">
                    <div className="relative lg:sticky top-8">
                        <PersonalWidget />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default PostPage