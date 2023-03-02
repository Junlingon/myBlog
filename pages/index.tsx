import type { NextPage } from 'next'
import { useState } from 'react'
import { PostCard, PersonalWidget, PostWidget, Categories, Pagination } from '../components'

// const random = ['document', 'book', 'girl', 'art', 'nature']
const posts = [
  { title: "React Testing", excerpt: 'Learn React Testing', id: 1, random: 'nature' },
  { title: "React with Tailwind", excerpt: 'Learn React', id: 2, random: 'art' },
]


const Home: NextPage = () => {
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
          {posts.map((post) => {
            return <PostCard post={post} key={post.title}></PostCard>
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

export default Home
