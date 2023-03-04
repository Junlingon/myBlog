import type { NextPage, GetStaticProps } from 'next'
import { useState } from 'react'
import { PostCard, PersonalWidget, PostWidget, Pagination } from '../components'
import { getFileIds } from '../utils/posts-md'

interface Props {
  markdownFilesList: string[],
  random: string[],
}

const pageSize = 3

const Home: NextPage<Props> = ({ markdownFilesList, random }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const firstPageIndex = (currentPage - 1) * pageSize
  const lastPageIndex = firstPageIndex + pageSize
  const pageCount = Math.ceil(markdownFilesList.length / pageSize)
  const pagination = {
    pageCount,
    currentPage
  }
  const currentData = markdownFilesList.slice(firstPageIndex, lastPageIndex)
  const recentData = markdownFilesList.slice(0, 5); // display 4 recent posts

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {currentData.map((post: any, index: number) => {
            return <PostCard post={post} key={index} random={random[index % 5]}></PostCard>
          })}
          {2 > 1 && <Pagination pagination={pagination} onPageChange={(page: number) => setCurrentPage(page)} />}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PersonalWidget />
            <PostWidget posts={recentData} />
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
      random: ['art', 'nature', 'girl', 'book', 'document',]
    },
  };
};

export default Home
