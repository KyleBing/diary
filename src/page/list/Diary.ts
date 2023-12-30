interface DiaryEntity {
    id: number,
    title: string,
    content: string,
    is_public: 0 | 1,
    is_markdown: 0 | 1,
    date: Date | string, // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
    weather: string,
    category: string,
    temperature: string,
    temperature_outside: string,
    billData?: []
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
