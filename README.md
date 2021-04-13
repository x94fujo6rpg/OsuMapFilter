# OsuMapFilter  
Filter existing maps  
過濾已有的圖  
效果:  
![](https://i.imgur.com/dkT6nFu.jpg)  

you need map list to make this script work  
if you from greasyfork, get python script on [my github](https://github.com/x94fujo6rpg/osuMapFilter)  

## update
v0.3:
fix for new site ui

v0.2: add stop button, fix some issue  
make map links open in new tab (prevent accidental clicks)  

## usage
require: [Python 3.8+](https://www.python.org/downloads/) / [Tampermonkey](https://www.tampermonkey.net/)  
* run `getmaplist.py`
* select osu install path (folder that contain `osu!.exe`)
default path:
`C:\Users\<Username>\AppData\Local\osu!`  
`C:\Program Files\osu!`  
`C:\Program Files(x86)\osu!`  
this will generate `map_list.txt`
* install [osuMapFilter.js](https://greasyfork.org/scripts/409887)
* when you open https://osu.ppy.sh/beatmapsets
* load `map_list.txt`
then it will start filtering maps
  
#### 中文說明:
需求: [Python 3.8](https://www.python.org/downloads/) / [Tampermonkey](https://www.tampermonkey.net/)  
* 執行 `getmaplist.py`
* 選擇osu安裝路徑 (`osu!.exe`所在資料夾)
預設路徑:  
`C:\Users\<Username>\AppData\Local\osu!`  
`C:\Program Files\osu!`  
`C:\Program Files(x86)\osu!`  
成功後會產生 `map_list.txt`
* 安裝 [osuMapFilter.js](https://greasyfork.org/scripts/409887)
* 打開 https://osu.ppy.sh/beatmapsets
* 檔案 > 選擇之前產生的 `map_list.txt`
檔案正確的話應該會開始過濾

