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

export {
    type DiaryEntity,
    type DiaryListOperation
}
