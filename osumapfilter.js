// ==UserScript==
// @name         osumapfilter
// @namespace    none
// @version      0.1
// @description  filter osu maps
// @author       x94fujo6
// @match        https://osu.ppy.sh/beatmapsets*
// @grant        none
// ==/UserScript==
/* jshint esversion: 6 */


(function() {
    'use strict';
    window.map_list = [];
    window.hindemaps = 0;
    window.filterloop = 0;
    window.isfilterdone = 0;

    window.onload = main();

    function main() {
        creatmybox();
        document.getElementById("read_osu_map_list")
            .addEventListener("change", readfile, false);
    }

    function checkmaplist() {
        if (map_list.length > 0) {
            runfilter();
        }
    }

    function updatestatus(anystr = "") {
        let status = document.getElementById("current_filter_status");
        status.textContent = anystr;
    }

    function runfilter() {
        if (isfilterdone === 1) {
            updatestatus("Filter stopped");
            return;
        }
        let new_list = Object.assign([], map_list);
        let de = 0;
        let re = new_list.length - 1;
        let allmaps = document.querySelectorAll("[data-audio-url]");
        console.log(allmaps);
        allmaps.forEach((item) => {
            setTimeout(() => {
                if (isfilterdone === 1) {
                    updatestatus("Filter stopped");
                    return;
                }
                let value = item.getAttribute("data-audio-url");
                value = value.replace("//b.ppy.sh/preview/", "");
                value = value.replace(".mp3", "");
                console.log(value);
                if (map_list.indexOf(value) > 0) {
                    hindemaps++;
                    updatestatus(`Filter is running\n${re} maps in list\nHide ${hindemaps} maps`);
                    item.querySelector(".beatmapset-panel__panel").style.opacity = "10%";
                }
            }, 0);
        });
        //runfilter();
    }

    function creatmybox() {
        let mystyle = {
            position: "fixed",
            top: "20%",
            right: "5%",
            width: "200px",
            "z-index": "100",
            border: "2px",
            "border-color": "rgba(255, 255, 255, 0.7)",
            "border-style": "ridge",
            "background-color": "rgba(255, 255, 255, 0.3)",
        };
        let newbox = document.createElement("div");
        Object.assign(newbox.style, mystyle);

        let readfile = document.createElement("input");
        Object.assign(readfile, {
            type: "file",
            id: "read_osu_map_list"
        });
        let status = document.createElement("span");
        status.id = "current_filter_status";
        status.style = "word-wrap:break-word;white-space:pre-line;";
        status.textContent = "Load map_list.txt to start";

        newbox.appendChild(readfile);
        newbox.appendChild(status);
        document.body.appendChild(newbox);
    }

    function readfile(myfile) {
        let file = myfile.target.files[0];
        if (!file) {
            isfilterdone = 1;
            updatestatus(`No file\nScript stopped`);
            return;
        }
        let reader = new FileReader();
        reader.onload = function(myfile) {
            let contents = myfile.target.result;
            map_list = JSON.parse(contents);
            console.log("read file success");
            isfilterdone = 0;
            checkmaplist();
        };
        reader.readAsText(file);
    }
})();