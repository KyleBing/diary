import diaryApi from "@/api/diaryApi.ts"
import {useStatisticStore} from "@/pinia/useStatisticStore.ts"
import {dateProcess, popMessage} from "@/utility.ts"
import {EntityBillDay, EntityBillItem, EntityBillMonth, EntityBillTop5Item} from "@/view/Bill/Bill.ts"
import type {Router} from "vue-router"

export function findDiaryDayForTop5Item(
    monthData: EntityBillMonth,
    top5Item: EntityBillTop5Item,
): EntityBillDay | undefined {
    for (const day of monthData.days) {
        const matched = day.items.find(item =>
            item.item === top5Item.item
            && Math.abs(item.price - top5Item.price) < 1e-6
        )
        if (matched) {
            return day
        }
    }

    let bestMatch: { day: EntityBillDay, diff: number } | undefined
    for (const day of monthData.days) {
        for (const item of day.items) {
            if (item.item !== top5Item.item) {
                continue
            }
            const diff = Math.abs(item.price - top5Item.price)
            if (!bestMatch || diff < bestMatch.diff) {
                bestMatch = { day, diff }
            }
        }
    }
    if (bestMatch) {
        return bestMatch.day
    }

    for (const day of monthData.days) {
        if (day.items.some(item => item.item === top5Item.item)) {
            return day
        }
    }

    return undefined
}

export function findDiaryIdForTop5Item(
    monthData: EntityBillMonth,
    top5Item: EntityBillTop5Item,
): number | undefined {
    return findDiaryDayForTop5Item(monthData, top5Item)?.id
}

export function buildBillItemsTooltipHtml(billItemArray: Array<EntityBillItem>, date?: string): string {
    const listContent = billItemArray.map(item =>
        `<tr class="bill-detail-list-item"><td>${item.item}</td><td class="price">${item.price.toFixed(2)}</td><tr/>`
    ).join('')
    let dateHeader = ''
    if (date) {
        const { date: dateLabel, weekShort } = dateProcess(date)
        dateHeader = `<div class="bill-detail-date">${dateLabel} ${weekShort}</div>`
    }
    return `
        ${dateHeader}
        <table class="bill-detail-list">
            <tbody>
            ${listContent}
            </tbody>
        </table>`
}

export function top5ItemTooltip(top5Item: EntityBillTop5Item, monthData?: EntityBillMonth) {
    if (!monthData) {
        return { disabled: true }
    }
    const day = findDiaryDayForTop5Item(monthData, top5Item)
    if (!day?.items.length) {
        return { disabled: true }
    }
    return {
        content: buildBillItemsTooltipHtml(day.items, day.date),
        html: true,
        theme: 'tooltip-bill',
    }
}

function isDiaryInMonth(diaryDate: string, monthId: string): boolean {
    const year = monthId.substring(0, 4)
    const month = monthId.substring(4, 6)
    const date = new Date(diaryDate)
    return date.getFullYear() === Number(year)
        && String(date.getMonth() + 1).padStart(2, '0') === month
}

export async function openBillItemEdit(
    router: Router,
    top5Item: EntityBillTop5Item,
    monthData?: EntityBillMonth,
) {
    if (monthData) {
        const diaryId = findDiaryIdForTop5Item(monthData, top5Item)
        if (diaryId) {
            await router.push({ name: 'Edit', params: { id: diaryId } })
            return
        }
    }

    const statisticStore = useStatisticStore()
    try {
        const res = await diaryApi.list({
            categories: JSON.stringify(
                statisticStore.getCategoryAllFromLocalStorage().map(item => item.name_en)
            ),
            keywords: JSON.stringify([top5Item.item]),
            pageSize: 100,
            pageNo: 1,
        })

        let diaries = res.data
        if (monthData && diaries.length > 1) {
            diaries = diaries.filter(item => isDiaryInMonth(item.date, monthData.month_id))
        }

        if (diaries.length === 1) {
            await router.push({ name: 'Edit', params: { id: diaries[0].id } })
            return
        }
        if (diaries.length > 1) {
            await router.push({ name: 'Edit', params: { id: diaries[0].id } })
            return
        }
        popMessage('warning', '未找到对应账单日记')
    } catch (err) {
        popMessage('warning', err instanceof Error ? err.message : '查询失败')
    }
}
