import {AuthorizationEntity} from "./entity/Authorization";
import {BillKey} from "./view/Bill/Bill";
import {useStatisticStore} from "./pinia/useStatisticStore";
import Moment from "moment";
const AUTHORIZATION_NAME = 'Authorization' // 存储用户信息的 localStorage name，跟 Manager 通用
const BILL_KEYS_NAME = 'BillKeys'

/**
 *  AUTHORIZATION
 */
export function getAuthorization(): AuthorizationEntity | undefined {
    let authJsonString = localStorage.getItem(AUTHORIZATION_NAME)
    if (authJsonString){
        return JSON.parse(authJsonString)
    } else {
        return undefined
    }
}

function notifyAuthSessionChanged() {
    if (typeof window === 'undefined') {
        return
    }
    import('./pinia/useProjectStore').then(({useProjectStore}) => {
        useProjectStore().bumpAuthRevision()
    }).catch(() => {})
}

export function deleteAuthorization() {
    localStorage.removeItem(AUTHORIZATION_NAME)
    removeBillKeys()
    notifyAuthSessionChanged()
}
export function setAuthorization(auth: AuthorizationEntity) {
    localStorage.setItem(AUTHORIZATION_NAME, JSON.stringify({
        nickname: auth.nickname,
        uid: auth.uid,
        email: auth.email,
        phone: auth.phone,
        avatar: auth.avatar,
        token: auth.token,
        group_id: auth.group_id,
        city: auth.city,
        geolocation: auth.geolocation
    }))
    notifyAuthSessionChanged()
}

/**
 * 保存账单常用项目列表
 * @param keyArray
 */
export function setBillKeys(keyArray: BillKey[]) {
    localStorage.setItem(BILL_KEYS_NAME, JSON.stringify(keyArray))
}

/**
 * 获取账单常用项目列表
 */
export function getBillKeys(): Array<BillKey> {
    let keysString = localStorage.getItem(BILL_KEYS_NAME)
    if (keysString) {
        return JSON.parse(keysString)
    } else {
        return []
    }
}

export function removeBillKeys() {
    localStorage.removeItem(BILL_KEYS_NAME)
}




/**
 * Prompt 提示
 * @param type
 * @param title
 * @param callback
 * @param timeout
 */
export function popMessage(
    type: 'default' | 'warning' | 'success' | 'danger',
    title: string,
    callback = () => {},
    timeout = 0.8
) {
    let popClass = `pop-msg-${type}`
    let msgEl = document.createElement('div')
    msgEl.classList.add('pop-msg', 'animated-fast', 'slideInDownPopMessage', popClass)
    let msgTitle = document.createElement('h3')
    msgTitle.innerText = title
    msgEl.append(msgTitle)
    $('body')?.append(msgEl)

    setTimeout(() => {
        msgEl.classList.remove('slideInDownPopMessage')
    }, 200)
    setTimeout(() => {

        // msgEl.classList.replace('slideInDown', 'slideOutUp')
        msgEl.classList.add('slideOutUpPopMessage')
        setTimeout(() => {
            msgEl.remove()
        }, 200); // 需要对应 css 中 .animated-fast 的动画过渡时间

        // 为了避免回调方法影响 动画的过程，将其异步处理
        setTimeout(() => {
            callback && callback()
        }, 200)

    }, 1000 * timeout)
}

export function $(selector: string) {
    return document.querySelector(selector)
}


// CONST
export enum EnumWeekDay {
    '周日' = 0,
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
}

export enum EnumWeekDayShort {
    '日' = 0,
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
}

// 格式化时间，输出字符串
export function dateFormatter(date: Date, formatString: string = 'yyyy-MM-dd hh:mm:ss') {
    let dateRegArray: Object = {
        "M+": date.getMonth() + 1,                      // 月份
        "d+": date.getDate(),                           // 日
        "h+": date.getHours(),                          // 小时
        "m+": date.getMinutes(),                        // 分
        "s+": date.getSeconds(),                        // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds()                     // 毫秒
    }
    if (/(y+)/.test(formatString)) {
        formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let section in dateRegArray) {
        if (new RegExp("(" + section + ")").test(formatString)) {
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)))
        }
    }
    return formatString
}

export interface DateUtilityObject{
    year: number,
    day: number,
    month: number,
    weekday: string,
    weekShort: string,
    dateShort: string,
    date: string,
    dateFull: string,
    dateFullSlash: string,
    timeLabel: string,
    time: string
}

export function dateProcess(dateString: string): DateUtilityObject {
    let date = new Date(dateString)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    // let seconds = date.getSeconds()
    let week = date.getDay()
    let timeLabel = ''
    if (hour >= 23 && hour < 24 || hour <= 3 && hour >= 0) {
        timeLabel = '深夜'
    } else if (hour >= 19 && hour < 23) {
        timeLabel = '晚上'
    } else if (hour >= 14 && hour < 19) {
        timeLabel = '傍晚'
    } else if (hour >= 11 && hour < 14) {
        timeLabel = '中午'
    } else if (hour >= 6 && hour < 11) {
        timeLabel = '早上'
    } else if (hour >= 3 && hour < 6) {
        timeLabel = '凌晨'
    }

    return {
        year,
        day,
        month,
        weekday: EnumWeekDay[week],
        weekShort: EnumWeekDayShort[week],
        dateShort: `${padNumberWith0(month)}-${padNumberWith0(day)}`,
        date: `${padNumberWith0(month)}月${padNumberWith0(day)}日`,
        dateFull: `${year}年${month}月${day}日`,
        dateFullSlash: `${year}/${month}/${day}`,
        timeLabel: timeLabel,
        time: `${padNumberWith0(hour)}:${padNumberWith0(minutes)}`
    }
}

export function padNumberWith0(num: number) {
    return String(num).padStart(2, '0')
}

/**
 * 将年份筛选的月份 id（如 202501）转换为接口过滤用的时间范围。
 * 输出格式：YYYY-MM-DD HH:mm:ss
 */
export function getMonthTimeRangeFromYearMonthId(yearMonthId: string): { timeStart: string, timeEnd: string } | undefined {
    if (!yearMonthId) return undefined
    const match = String(yearMonthId).match(/^(\d{4})(\d{2})$/)
    if (!match) return undefined

    const year = Number(match[1])
    const month = Number(match[2])
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return undefined

    const start = Moment().year(year).month(month - 1).startOf('month')
    const end = Moment().year(year).month(month - 1).endOf('month')
    return {
        timeStart: start.format('YYYY-MM-DD HH:mm:ss'),
        timeEnd: end.format('YYYY-MM-DD HH:mm:ss'),
    }
}

/** 导航栏等：将 timeStart / timeEnd（含时间部分）显示为 `2026-04-03 ~ 2026-04-03` */
export function formatDiaryDateRangeLabel(timeStart: string, timeEnd: string): string {
    const s = (timeStart || '').trim()
    const e = (timeEnd || '').trim()
    if (!s || !e) return ''
    return `${s.slice(0, 10)} ~ ${e.slice(0, 10)}`
}

export function temperatureProcessSTC(temperature: number | string) {
    return temperature === -273 ? '' : String(temperature)
}

export function temperatureProcessCTS(temperature: number | string) {
    return temperature === '' ? -273 : Number(temperature)
}

export interface DiaryConfigEntity {
    isFilterShared: boolean, // 是否筛选共享日记
    keywords: string[], // 关键词
    filteredCategories: string[], // 筛选的日记类别
    dateFilterTimeStart: string, // YYYY-MM-DD HH:mm:ss
    dateFilterTimeEnd: string, // YYYY-MM-DD HH:mm:ss
}

export function getDiaryConfigFromLocalStorage() {
    let diaryConfigString = localStorage.getItem('DiaryConfig')
    if (diaryConfigString) {
        const parsed = JSON.parse(diaryConfigString) as Partial<DiaryConfigEntity> & { dateFilterString?: string }
        let dateFilterTimeStart = parsed.dateFilterTimeStart ?? ''
        let dateFilterTimeEnd = parsed.dateFilterTimeEnd ?? ''
        // 旧版仅有 dateFilterString（如 202501）时，迁移为 time 区间并写回本地
        if ((!dateFilterTimeStart || !dateFilterTimeEnd) && parsed.dateFilterString) {
            const migrated = getMonthTimeRangeFromYearMonthId(parsed.dateFilterString)
            if (migrated) {
                dateFilterTimeStart = migrated.timeStart
                dateFilterTimeEnd = migrated.timeEnd
                const upgraded: DiaryConfigEntity = {
                    isFilterShared: parsed.isFilterShared ?? false,
                    keywords: parsed.keywords ?? [],
                    filteredCategories: parsed.filteredCategories ?? useStatisticStore().categoryAll.map(item => item.name_en),
                    dateFilterTimeStart,
                    dateFilterTimeEnd,
                }
                setDiaryConfig(upgraded)
            }
        }
        return {
            isFilterShared: parsed.isFilterShared ?? false,
            keywords: parsed.keywords ?? [],
            filteredCategories: parsed.filteredCategories ?? useStatisticStore().categoryAll.map(item => item.name_en),
            dateFilterTimeStart,
            dateFilterTimeEnd,
        } as DiaryConfigEntity
    } else {
        // 如果不存在配置，生成一个新的
        let newDiaryConfig: DiaryConfigEntity = {
            isFilterShared: false, // 是否筛选共享日记
            keywords: [], // 关键词
            filteredCategories: useStatisticStore().categoryAll.map(item => item.name_en), // 筛选的日记类别
            dateFilterTimeStart: '',
            dateFilterTimeEnd: '',
        }
        setDiaryConfig(newDiaryConfig)
        return newDiaryConfig
    }
}

export function setDiaryConfig(newValue: DiaryConfigEntity) {
    localStorage.setItem('DiaryConfig', JSON.stringify(newValue))
}

export function removeDiaryConfig() {
    localStorage.removeItem('DiaryConfig')
}



export function isInMobileMode(): boolean{
    // console.log(state.insets)
    // 宽度小于 1024 或 高>宽 时，表示是在移动设备上
    return innerWidth < 1024 || innerWidth < innerHeight
}