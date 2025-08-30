import {DateUtilityObject} from "../../utility";
import { EntityBillDay } from "../Bill/Bill";


// DIARY ENTITY
// 接口返回的数据类型
export interface EntityDiaryFromServer{
    id: number, // 19286,
    date: string, // "2025-08-29T02:31:14.000Z",
    title: string, // "能耗添加加载子类型的开关",
    content: string, // "- 能耗添加加载子类型的开关",
    temperature: number, // -273,
    temperature_outside: number, // 29,
    weather: string, // "cloudy",
    category: string, // "work",
    date_create: string, // "2025-08-29T02:31:31.000Z",
    date_modify: string, // "2025-08-29T02:31:32.000Z",
    uid: number, // 3,
    is_public: 0|1, // 0,
    is_markdown: 0|1 // 0

    // 账单时，列表会返回 billData
    billData?: Array<EntityBillDay>,
}

export interface EntityDiaryFromServerLocal extends EntityDiaryFromServer{
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
}



export interface EntityDiaryForm extends Omit<EntityDiaryFromServer, 'date_create' | 'date_modify' | 'billData' | 'date' | 'is_public' | 'is_markdown'>{
    is_public: boolean,
    is_markdown: boolean,
    date: Date|string, // 本页面新建时，保留之前日记的时间，因为可能一次性补全很多之前的日记
}

export interface EntityDiaryListOperation {
    type: 'add' | 'delete' | 'change',
    diary: EntityDiaryForm|undefined,
    id: number
}


export interface EntityDiaryWaterfall extends EntityDiaryFromServer{
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
export interface EntityDiaryFromServerCategoryOnly{
    id: number
    date: Date|string|number,
    category: string,
}
// 数据库 diary 只包含标题、类别
export interface EntityDiaryFromServerTitleOnly{
    id: number
    title: string,
    date: Date|string|number,
    category: string,
}
