interface DiaryEntity {
    id: number|null,
    title: string,
    content: string,
    is_public: 1|0,
    is_markdown: 1|0,
    date: Date, // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
    weather: string,
    category: string,
    temperature: string,
    temperature_outside: string,
    billData?: [],
    dateObj?: any,

    // add
    categoryString? : string,
    contentHtml? : string,
    nickname?: string,
    username?: string

    // share
    weekday?: string,
    dateString? : string
}

interface DiaryListOperation {
    type: 'add' | 'delete' | 'change',
    diary: DiaryEntity,
    id: number
}



interface DiarySearchParams {
    keywords: string[],
    pageNo: number,
    pageSize: number, // 单页请求条数
    categories: string,
    filterShared: 0|1, // 1 是筛选，0 是不筛选
    dateFilterString: string // 日记年月筛选
}

interface DiarySubmitEntity{
    id: number,
    title: string,
    content: string,
    category: string,
    temperature: number,
    temperature_outside: number,
    weather: string,
    is_public: 1 | 0,
    is_markdown: 1 | 0,
    date: string,
}

export {
    type DiaryEntity,
    type DiaryListOperation,
    type DiarySearchParams,
    type DiarySubmitEntity
}
