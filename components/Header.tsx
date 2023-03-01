import Link from 'next/link'
import React, { ReactNode, useContext, useState } from 'react'

type category = {
    name: String;
    slug: String;
}

const categories: Array<category> = [
    { name: 'Font Dev', slug: 'font' },
    { name: 'golang', slug: 'golang' }
]

const Header = () => {

    // const [categories, setCategories] = useState([])


    return (
        <div className='container mx-auto px-10 mb-8'>
            <div className="border-b-2 w-full inline-block border-white py-8">
                <div className="md:float-left block">
                    <Link href="/">
                        <span className='cursor-pointer font-bold text-4xl text-white'>
                            Alin’s blog
                        </span>
                    </Link>
                </div>
                <div className="md:float-right md:contents">
                    {categories.map((category, index) => {
                        <Link key={index} href={`/category/${category.slug}`}>
                            <span className='cursor-pointer md:float-right mt-2 align-middle text-white ml-4'>
                                {category.name}
                            </span>
                        </Link>
                    }) as ReactNode}
                </div>
            </div>
        </div>
    )
}

export default Header