import type { NextPage, GetStaticProps } from 'next'
import { useState } from 'react'
import { PostCard, PersonalWidget, PostWidget, Pagination } from '../components'
import { getFileIds, getSortedPostsData } from '../utils/posts-md'
import { ymd } from '../utils/dateformat'

interface Props {
  markdownFilesList: [{
    title: string,
    description: string,
    date: Date,
    random: string,
    tags: string[]
  }],
  random: string[],
  b: [{
    title: string,
    description: string,
    date: Date,
    random: string,
    tags: string[]
  }],
}

const pageSize = 3

const Home: NextPage<Props> = ({ markdownFilesList, b }) => {

  console.log(b)
  const [currentPage, setCurrentPage] = useState(1)
  const firstPageIndex = (currentPage - 1) * pageSize
  const lastPageIndex = firstPageIndex + pageSize
  const pageCount = Math.ceil(b.length / pageSize)
  const pagination = {
    pageCount,
    currentPage
  }
  const currentData = b.slice(firstPageIndex, lastPageIndex)
  const recentData = b.slice(0, 3); // display 3 recent posts

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {currentData.map((post: any, index: number) => {
            return <PostCard post={post} key={index}></PostCard>
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
  const a = (await getSortedPostsData(folderPath))
  const b = a.map((item) => {
    return { ...item, ...{ date: ymd(item.date) } }
  })
  console.log(b)
  return {
    props: {
      markdownFilesList,
      b,
    },
  };
};

export default Home
