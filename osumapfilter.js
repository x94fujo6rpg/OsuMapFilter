// ==UserScript==
// @name         osuMapFilter
// @namespace    https://greasyfork.org/users/110545
// @updateURL    https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @downloadURL  https://github.com/x94fujo6rpg/osuMapFilter/raw/master/osumapfilter.js
// @version      0.2
// @description  filter osu maps
// @author       x94fujo6
// @match        https://osu.ppy.sh/beatmapsets
// @match        https://osu.ppy.sh/beatmapsets?*
// @grant        none
// ==/UserScript==
/* jshint esversion: 6 */
/* 
you need map list to make this work!!!
https://github.com/x94fujo6rpg/osuMapFilter
 */


(function () {
    'use strict';
    let map_list = [];
    let hidemaps = 0;
    let stop = false;
    window.onload = main();

    function main() {
        creatbox();
        document.getElementById("read_osu_map_list")
            .addEventListener("change", readfile, false);
    }

    function updatestatus(anystr = "") {
        let status = document.getElementById("current_filter_status");
        status.textContent = anystr;
    }

    function runfilter() {
        if (stop || map_list.length === 0) return updatestatus("Filter stopped");
        let all_map_id = document.querySelectorAll("[data-audio-url]");
        let count = all_map_id.length;
        hidemaps++;
        updatestatus(`Filter is running\n${map_list.length} maps in list`);
        all_map_id.forEach(item => {
            setTimeout(() => {
                if (stop || map_list.length === 0) return updatestatus("Filter stopped");

                let map_id = item.getAttribute("data-audio-url").split("/");
                map_id = map_id[map_id.length-1].replace(".mp3", "");
                map_id = parseInt(map_id, 10);
                if (map_list.includes(map_id)) {
                    item.querySelector(".beatmapset-panel__panel").style.opacity = "10%";
                }

                let link = item.querySelector(`a[href$="${map_id}"]`);
                link.setAttribute("target", "_blank");

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
                toInt();
                runfilter();
            }
        };
        reader.readAsText(file);
    }

    function toInt() {
        map_list.forEach((id, index) => map_list[index] = parseInt(id, 10));
    }
})();