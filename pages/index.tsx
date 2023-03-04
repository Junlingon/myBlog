import type { NextPage, GetStaticProps } from 'next'
import { useState } from 'react'
import { PostCard, PersonalWidget, PostWidget, Categories, Pagination } from '../components'
import { getFileIds, getFileData } from '../utils/posts-md'
// const random = ['document', 'book', 'girl', 'art', 'nature']
const posts = [
  { title: "React Testing", excerpt: 'Learn React Testing', id: 1, random: 'nature' },
  { title: "React with Tailwind", excerpt: 'Learn React', id: 2, random: 'art' },
]

interface Props {
  markdownFilesList: any
}

const Home: NextPage<Props> = ({ markdownFilesList }) => {
  const [currentPage, setCurrentPage] = useState(1)
  // const firstPageIndex = (currentPage - 1) * pageSize
  // const lastPageIndex = firstPageIndex + pageSize
  // const pageCount = Math.ceil(postsData.length / pageSize)
  // const pagination = {
  //   pageCount,
  //   currentPage
  // }

  // const currentData = postsData.slice(firstPageIndex, lastPageIndex)

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {markdownFilesList.map((post: any, index: number) => {
            return <PostCard post={post} key={index}></PostCard>
          })}
          {2 > 1 && <Pagination pagination={{ currentPage: currentPage, pageCount: 2 }} onPageChange={(page: number) => setCurrentPage(page)} />}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PersonalWidget />
            <PostWidget posts={posts} />
            <Categories />
          </div>
        </div>
      </div>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  // Markdown 文件所在的文件夹路径
  const folderPath = './articles';

  // 读取文件夹中的所有文件
  // 过滤出所有 Markdown 文件，并返回文件名列表
  const markdownFilesList = (await getFileIds(folderPath))
  return {
    props: {
      markdownFilesList,
    },
  };
};

export default Home
