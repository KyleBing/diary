import {DateUtilityObject} from "../../utility";

export interface DiaryEntity {
    id: number
    title: string,
    content: string,
    is_public: boolean,
    is_markdown: boolean,
    date: Date|string|number, // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
    weather: string,
    category: string,
    temperature: string,
    temperature_outside: string,
}

export interface DiaryListOperation {
    type: 'add' | 'delete' | 'change',
    diary: DiaryEntity|undefined,
    id: number
}

// 数据库 diary
export interface DiaryEntityFromServer{
    id: number
    title: string,
    content?: string,
    is_public: 1|0,
    is_markdown: 1|0,
    date: Date|string|number,
    weather: string,
    category: string,
    temperature: string,
    temperature_outside: string,

    // bill
    billData?: [],

    // detail
    dateObj?: DateUtilityObject,

    // share
    categoryString? : string,
    contentHtml? : string,
    nickname?: string,
    username?: string
    weekday?: string,
    weekdayShort?: string,
    dateString? : string

    isShowItemWeekDayShort?: boolean, // 是否显示缩写星期，列表的时候用
}

export interface DiaryEntityWaterfall extends DiaryEntityFromServer{
    position: {
        top: number,
        left: number,
        col: number
    }
}


export interface DiarySearchParams {
    keywords: Array<string> | string, // 关键字 JSON string 后的内容 : string[]
    pageNo: number,
    pageSize: number, // 单页请求条数
    categories: string,
    filterShared?: 0|1, // 1 是筛选，0 是不筛选
    dateFilterString?: string // 日记年月筛选
}

export interface DiarySearchParamsForCalendar extends DiarySearchParams {
    dateStart: string, // date string, format: YYYYMMDD
    dateEnd: string, // date string, format: YYYYMMDD
}

export interface DiarySubmitEntity{
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

// 日记添加的 response
export interface ResponseDiaryAdd{
    success: boolean,
    data: {
        id: number
    },
    message: string
}


export enum EnumWeather{
    'sunny' = 100,        // 晴
    'cloudy' = 101,       // 多云
    'overcast' = 104,     // 阴
    'sprinkle' = 305,     // 小雨
    'rain' = 306,         // 中雨
    'thunderstorm' = 310, // 暴雨
    'snow' = 499,         // 雪
    'fog' = 501,          // 雾
    'sandstorm' = 507,    // 沙尘暴
    'smog' = 502,         // 霾
}


/**
 * 日历用
 */

// 数据库 diary 只包含类别
export interface DiaryEntityFromServerCategoryOnly{
    id: number
    date: Date|string|number,
    category: string,
}
// 数据库 diary 只包含标题、类别
export interface DiaryEntityFromServerTitleOnly{
    id: number
    title: string,
    date: Date|string|number,
    category: string,
}
