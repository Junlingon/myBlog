// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}


import * as fs from 'fs'
import path from 'path';

// Markdown 文件所在的文件夹路径
const folderPath = '../articles';

// 读取文件夹中的所有文件
const files = fs.readdirSync(folderPath);

// 过滤出所有 Markdown 文件，并返回文件名列表
const markdownFiles = files.filter((file: any) => path.extname(file) === '.md').map((file: any) => path.basename(file, '.md'));
console.log(markdownFiles)