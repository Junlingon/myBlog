import type { NextPage, GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import { PersonalWidget, PostDetail } from '../../components'
import { getFileIds, getFileData } from '../../utils/posts-md'

const PostPage: NextPage = (post: InferGetStaticPropsType<GetStaticProps>) => {
    const router = useRouter()
    if (router.isFallback) {
        return <div className='flex justify-center items-center text-xl font-semibold text-white'>Loading......</div>
    }

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-12">
                <div className="lg:col-start-2 lg:col-span-10 col-span-1">
                    <PostDetail post={post.Data} />
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // Markdown 文件所在的文件夹路径
    const folderPath = './articles';

    // 读取文件夹中的所有文件
    // 过滤出所有 Markdown 文件，并返回文件名列表
    const markdownFiles = (await getFileIds(folderPath))

    const Data = await getFileData('./articles', params?.slug)
    return {
        props: {
            markdownFiles,
            Data
        },
    };
};

export async function getStaticPaths() {
    const paths = (await getFileIds('./articles')).map((slug) => {
        return { params: { slug } };
    });
    return {
        paths,
        fallback: false,
    };
}

export default PostPage