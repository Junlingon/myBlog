import { promises as fsp } from "fs";
import path from "path";
import fm from "front-matter";
import { remark } from "remark";
import remarkhtml from "remark-html";
import * as dateformat from "./dateformat";
import { parseISO } from "date-fns";

const fileExt = "md";

// 获取文件夹相对路径
function absPath(dir) {
    return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}

/**
 * 获取文件夹中 Markdown 文件名列表，以数组形式返回
 * @param {*} dir
 * @returns
 */
export async function getFileIds(dir = "./") {
    const loc = absPath(dir);
    const files = await fsp.readdir(loc);

    return files
        .filter((fn) => path.extname(fn) === `.${fileExt}`)
        .map((fn) => path.basename(fn, path.extname(fn)));
}


// 获取所有文章用于展示首页列表的数据
export async function getSortedPostsData(dir = "./") {
    const loc = absPath(dir);
    const files = await fsp.readdir(loc);
    // // 获取所有md文件用于展示首页列表的数据，包含id，元数据（标题，时间）
    const asyncPostsData = files.map(
        async (file) => {
            const data = await fsp.readFile(path.join(loc, file), "utf8");
            const matter = fm(data);
            const slug = file.replace(/\.md$/, "")
            return {
                slug,
                ...matter.attributes,
            };
        }
    );
    return Promise.all(asyncPostsData).then(results => {
        return results.sort(({ date: a }, { date: b }) =>
            // parseISO：字符串转日期
            parseISO(a) < parseISO(b) ? 1 : -1
        );
    });
}

/**
 * 获取单个 Markdown 文件的内容
 * @param {*} dir
 * @param {*} id
 * @returns
 */
export async function getFileData(dir = "./", id) {
    const file = path.join(absPath(dir), `${id}.${fileExt}`),
        stat = await fsp.stat(file),
        data = await fsp.readFile(file, "utf8"),
        matter = fm(data),
        html = (await remark().use(remarkhtml).process(matter.body)).toString();

    // 日期格式化
    const date = matter.attributes.date || stat.ctime;
    matter.attributes.date = date.toUTCString();
    matter.attributes.dateYMD = dateformat.ymd(date);
    matter.attributes.dateFriendly = dateformat.friendly(date);

    // 计数
    const roundTo = 10,
        readPerMin = 200,
        numFormat = new Intl.NumberFormat("en"),
        count = matter.body
            .replace(/\W/g, " ")
            .replace(/\s+/g, " ")
            .split(" ").length,
        words = Math.ceil(count / roundTo) * roundTo,
        mins = Math.ceil(count / readPerMin);

    matter.attributes.wordcount = `${numFormat.format(
        words
    )} words, ${numFormat.format(mins)}-minute read`;

    return {
        id,
        html,
        ...matter.attributes,
    };
}