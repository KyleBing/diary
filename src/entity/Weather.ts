export const WeatherArray = [
  {value : 'sunny' ,        label : '晴'} ,
  {value : 'cloudy' ,       label : '多云'} ,
  {value : 'overcast' ,     label : '阴'} ,
  {value : 'sprinkle' ,     label : '小雨'} ,
  {value : 'rain' ,         label : '雨'} ,
  {value : 'thunderstorm' , label : '暴雨'} ,
  {value : 'snow' ,         label : '雪'} ,
  {value : 'fog' ,          label : '雾'} ,
  {value : 'tornado' ,      label : '龙卷风'} ,
  {value : 'smog' ,         label : '雾霾'} ,
  {value : 'sandstorm' ,    label : '沙尘暴'} ,
]

export const WeatherMap: Map<string, string> = new Map(WeatherArray.map(item => [item.value, item.label]))

