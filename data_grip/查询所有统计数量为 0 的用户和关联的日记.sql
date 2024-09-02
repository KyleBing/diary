delete diaries
from diaries join users on users.uid = diaries.uid
where users.count_diary < 5
  and users.count_qr = 0
  and users.count_words = 0
  and users.count_dict = 0
  and users.count_map_route = 0
  and users.count_map_pointer = 0
  and users.sync_count = 0
  and users.uid > 10
and users.last_visit_time < '2024-01-01 00:00:00'

;