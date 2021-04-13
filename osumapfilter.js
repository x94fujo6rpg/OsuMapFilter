// ==UserScript==
// @name         osuMapFilter
// @namespace    https://greasyfork.org/users/110545
// @updateURL    https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @downloadURL  https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @version      0.4
// @description  filter osu maps
// @author       x94fujo6
// @match        https://osu.ppy.sh/beatmapsets
// @match        https://osu.ppy.sh/beatmapsets?*
// @grant        none
// ==/UserScript==
/* jshint esversion: 9 */
/* 
you need map list to make this work!!!
https://github.com/x94fujo6rpg/osuMapFilter
*/

(function () {
    'use strict';
    let map_list = [];
    let stop = false;
    let debug_msg = false;
    let mode = 2; // 1:array 2:hash 3:set, https://jsbench.me/zfknghmteu/2
    let tester;
    switch (mode) {
        case 1:
            tester = (id) => { return map_list.includes(id); };
            break;
        case 2:
            tester = (id) => { return map_list[id]; };
            break;
        case 3:
            tester = (id) => { return map_list.has(id); };
            break;
        default:
            tester = false;
            break;
    }
    if (!tester) return console.log("tester not set");
    window.onload = main();

    function main() {
        creatbox();
        document.getElementById("read_osu_map_list")
            .addEventListener("change", readfile, false);
    }

    function updatestatus(text = "") {
        document.getElementById("current_filter_status").textContent = text;
    }

    function runfilter() {
        let length = mode == 3 ? map_list.size : map_list.length;
        if (stop || length === 0) return updatestatus("Filter stopped");
        let all_map = document.querySelectorAll(".beatmapsets__item");
        let count = all_map.length;
        updatestatus(`Filter is running\n${length} maps in list`);
        all_map.forEach(item => {
            setTimeout(() => {
                if (stop || length === 0) return updatestatus("Filter stopped");
                let map_id = item.querySelector(`[data-audio-url]`).getAttribute("data-audio-url").match(/\/(\d+)\.mp3/);
                if (!map_id) return;
                map_id = map_id[1];
                if (tester(map_id)) {
                    item.style.opacity = "10%";
                    if (debug_msg) console.log(`${count} hide ${map_id}`);
                }
                let link = item.querySelectorAll("a");
                link.forEach(a => { if (!a.href.includes("/download")) a.setAttribute("target", "_blank"); });
                count--;
                if (count === 0) setTimeout(runfilter, 100);
            }, 0);
        });
    }

    function creatbox() {
        let newbox = document.createElement("div");
        Object.assign(newbox.style, {
            position: "fixed",
            top: "20%",
            right: "5%",
            width: "200px",
            "z-index": "100",
            border: "2px",
            "border-color": "rgba(255, 255, 255, 0.7)",
            "border-style": "ridge",
            "background-color": "rgba(255, 255, 255, 0.3)",
        });
        let readfile = document.createElement("input");
        Object.assign(readfile, {
            type: "file",
            id: "read_osu_map_list"
        });
        let status = document.createElement("span");
        Object.assign(status, {
            id: "current_filter_status",
            style: "word-wrap:break-word;white-space:pre-line;",
            textContent: "Load map_list.txt to start"
        });
        let button = document.createElement("button");
        Object.assign(button, {
            textContent: "Stop Script",
            style: "color: black",
            onclick: function () {
                stop = true;
                updatestatus("Filter stopped");
            }
        });
        newbox.appendChild(readfile);
        newbox.appendChild(status);
        newbox.appendChild(button);
        document.body.appendChild(newbox);
    }

    function readfile(myfile) {
        let file = myfile.target.files[0];
        if (!file) {
            stop = true;
            updatestatus("Filter stopped");
            return;
        }
        let reader = new FileReader();
        reader.onload = function (myfile) {
            let contents = myfile.target.result;
            map_list = JSON.parse(contents);
            stop = 0;
            if (map_list.length > 0) {
                switch (mode) {
                    case 1:
                        console.log("mode: array");
                        break;
                    case 2:
                        console.log("mode: hash");
                        let new_obj = {};
                        map_list.forEach(id => new_obj[id] = true);
                        new_obj.length = map_list.length;
                        map_list = new_obj;
                        break;
                    case 3:
                        console.log("mode: set");
                        map_list = new Set(map_list);
                        break;
                }
                runfilter();
            }
        };
        reader.readAsText(file);
    }
})();

