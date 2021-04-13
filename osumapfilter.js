// ==UserScript==
// @name         osuMapFilter
// @namespace    https://greasyfork.org/users/110545
// @updateURL    https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @downloadURL  https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @version      0.3
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
    let hidemaps = 0;
    let stop = false;
    let debug_msg = false;
    let use_hash = false;
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
        if (stop || map_list.length === 0) return updatestatus("Filter stopped");
        let all_map = document.querySelectorAll(".beatmapsets__item");
        let count = all_map.length;
        hidemaps++;
        updatestatus(`Filter is running\n${map_list.length} maps in list`);
        all_map.forEach(item => {
            setTimeout(() => {
                if (stop || map_list.length === 0) return updatestatus("Filter stopped");
                let map_id = item.querySelector(`[data-audio-url]`).getAttribute("data-audio-url").match(/\/(\d+)\.mp3/);
                if (!map_id) return;
                map_id = map_id[1];
                if (use_hash ? map_list[map_id] : map_list.includes(map_id)) {
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
                if (use_hash) {
                    let new_obj = {};
                    map_list.forEach(id => new_obj[id] = 1);
                    new_obj.length = map_list.length;
                    map_list = new_obj;
                }
                runfilter();
            }
        };
        reader.readAsText(file);
    }
})();
