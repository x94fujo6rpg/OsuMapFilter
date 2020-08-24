// ==UserScript==
// @name         osuMapFilter
// @namespace    https://greasyfork.org/users/110545
// @version      0.1
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


(function() {
    'use strict';
    window.map_list = [];
    window.hindemaps = 0;
    window.filterloop = 0;
    window.isfilterdone = 0;
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
        if (isfilterdone === 1 || map_list.length === 0) {
            updatestatus("Filter stopped");
            return;
        }
        let allmaps = document.querySelectorAll("[data-audio-url]");
        let count = allmaps.length;
        hindemaps++;
        updatestatus(`Filter is running\n${map_list.length} maps in list`);
        allmaps.forEach((item) => {
            setTimeout(() => {
                if (isfilterdone === 1) {
                    updatestatus("Filter stopped");
                    return;
                }
                let value = item.getAttribute("data-audio-url");
                value = value.replace("//b.ppy.sh/preview/", "");
                value = value.replace(".mp3", "");
                if (map_list.indexOf(String(value)) != -1) {
                    item.querySelector(".beatmapset-panel__panel").style.opacity = "10%";
                }
                count--;
                if (count === 0) {
                    setTimeout(() => {
                        runfilter();
                    }, 1);
                }
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

        newbox.appendChild(readfile);
        newbox.appendChild(status);
        document.body.appendChild(newbox);
    }

    function readfile(myfile) {
        let file = myfile.target.files[0];
        if (!file) {
            isfilterdone = 1;
            updatestatus("Filter stopped");
            return;
        }
        let reader = new FileReader();
        reader.onload = function(myfile) {
            let contents = myfile.target.result;
            map_list = JSON.parse(contents);
            isfilterdone = 0;
            if (map_list.length > 0) {
                runfilter();
            }
        };
        reader.readAsText(file);
    }
})();