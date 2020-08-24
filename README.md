# OsuMapFilter  
Filter existing maps  
地圖過濾  
效果:  
![](https://i.imgur.com/dkT6nFu.jpg)
  

require / 需要安裝:
[Python 3.8](https://www.python.org/downloads/) / 
[Tampermonkey](https://www.tampermonkey.net/)

run / 執行 `getmaplist.py`

select osu install path (folder that contain `osu!.exe`)
  
選擇osu安裝路徑
  
default path / 預設路徑:
`C:\Users\<Username>\AppData\Local\osu!`
`C:\Program Files\osu!`
`C:\Program Files(x86)\osu!`

this will generate / 產生 `map_list.txt`

install / 安裝 `osumapfilter.js`

when you open / 打開 https://osu.ppy.sh/beatmapsets

load / 載入 `map_list.txt`

then it will start filtering maps / 檔案正確的話應該會開始過濾 效果如上方的圖

to stop script, load file again but dont select anything = empty list, script stop when list is empty

停止腳本執行: 點擊選擇檔案 但什麼都不要選 直接關閉 = 清空列表 = 腳本自動停止
