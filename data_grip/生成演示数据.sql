INSERT INTO diary.diaries (date, title, content, temperature, temperature_outside, weather, category, date_create,
                           date_modify, uid, is_public, is_markdown)
select date,
       title,
       content,
       temperature,
       temperature_outside,
       weather,
       category,
       date_create,
       date_modify,
       10,
       is_public,
       is_markdown
from diary.diaries
where uid = 3
  and category = 'memo'
  and title not REGEXP '闲鱼|龚|林晴|点点|爸|姑|姨|邴|工资|闫|密码|王奇|金|酒店|宾馆|华山|泰物|她|癫痫|贷|哥|志辉|仁远|姣|延璐|肛|杀|5530|韩'
  and content not REGEXP '闲鱼|龚|林晴|点点|爸|姑|姨|邴|工资|闫|密码|王奇|金|酒店|宾馆|华山|泰物|她|癫痫|贷|哥|志辉|仁远|姣|延璐|肛|杀|5530|韩'
  and date
    between '2024-01-01 00:00:00' and '2025-03-14 11:26:06'
