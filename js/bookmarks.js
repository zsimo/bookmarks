/*jslint browser:true*/
/*global console:true,alert:true,confirm:true,forin: true,ActiveXObject:true,FormData:true */

// # bookmarks table
// - id
// - name
// - link
// - date
// - tags (comma separated)
// - note

// # tags table
// - id
// - bookmarks id
// - tag
        




// obj.style.transition = "transition: all " + myDuration + "s ease-in;";
// multiple transition separated dalla VIRGOLA
// transition: all 500ms ease-in, width 500ms ease-in 500ms;
// -webkit-transition:width 2s, height 2s, background-color 2s, -webkit-transform 2s;
// multiple transform separated dallo SPAZIO
// transform: rotate(200deg)  translateX(-300px);



(function (global) {

    "use strict";

    var Bookmarks = (function () {

        var
            
            getSingleElement = function (htmlPeace, startTag, closeTag) {
                var startIndex,
                    stopIndex,
                    tempHtml = htmlPeace;
                
//                console.log(tempHtml.indexOf(startTag));
                startIndex = tempHtml.indexOf(startTag) + startTag.length;

    //            console.log("************");
    //            console.log(startTag);
    //            console.log(tempHtml);
    //            console.log(startIndex);
                tempHtml = tempHtml.substring(startIndex);
                stopIndex = tempHtml.indexOf(closeTag);
                tempHtml = tempHtml.substring(0, stopIndex);

    //            var stopIndex = htmlPeace.substring(startIndex + DT.length, htmlPeace.indexOf("<DT>"));

    //            console.log("startIndex " + startIndex);
    //            console.log("stopIndex " + stopIndex);
    //            console.log(tempHtml);
                return tempHtml;

            },
            
            sendDataToTheServerCallback = function (httpRequestProgressEvent) {
                var xhr = httpRequestProgressEvent.currentTarget;
                
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        console.log(xhr.responseText);

                    } else {
                        console.log("xhr.status === 200 ERROR");
                    }
                }
            
            },
            
            sendDataToTheServer = function (serverScriptUrl, dataObject, callback) {
                var xhr, formData, key;
                try {
                    xhr = new XMLHttpRequest();
                } catch (e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (xhr === null) {
                    console.log("Ajax not supported by your browser!");
                    return;
                }

                formData = new FormData();
                for (key in dataObject) {
                    if (dataObject.hasOwnProperty(key)) {
                        formData.append(key, dataObject[key]);
                    }
                }

                xhr.onreadystatechange = callback;

                xhr.open("POST", serverScriptUrl, true);

                xhr.send(formData);

            },
            
            // usage: crawlHtml(html, "<DT>");
            crawlHtml = function (html, tag) {
                var startIndex,
                    stopIndex,
                    H3 = "</H3>",
                    temp,
                    counter = 0,
                    title,
                    bookmarks = {},
                    singleBookmarkObject = {},
                    linksArray = [];

                while (html.indexOf(tag) !== -1) {
//                while (counter < 20) {
                    startIndex = html.indexOf(tag) + tag.length;
                    html = html.substring(startIndex);
                    stopIndex = html.indexOf(tag);
                    // se sei alla fine (non hai un <dt> alla fine) prendi cio che rimane
                    if (stopIndex === -1) {
                        temp = html.substring(0);
                    } else {
                        temp = html.substring(0, stopIndex);
                    }

                    // check if it's a folder
                    if (temp.indexOf(H3) !== -1) {
                        title = temp.substring(temp.indexOf(">") + 1, temp.indexOf(H3));
                        linksArray = [];
//                        console.log("title " + title);
//                        console.log("folder");
                    } else {
                        if (!title) { // delicious bookmarks has not folders
                            title = "root";
                        }
                        singleBookmarkObject = {};
                        singleBookmarkObject.name = getSingleElement(temp, '">', '</A>');
                        singleBookmarkObject.date = getSingleElement(temp, 'ADD_DATE="', '"');
                        singleBookmarkObject.href = getSingleElement(temp, 'HREF="', '"');
                        if (temp.indexOf('TAGS="') === -1) {// non ce tag, sono i bookmarks di chrome
                            singleBookmarkObject.tags = title.toLowerCase();
                        } else {// sono i bookmarks di delicious
                            singleBookmarkObject.tags = getSingleElement(temp, 'TAGS="', '">').toLowerCase();
                        }

//                        console.log("name " + getSingleElement(temp, '">', '</A>'));
    //                    console.log("href " + getSingleElement(temp, 'HREF="', '"'));
//                        console.log("tags " + getSingleElement(temp, 'TAGS="', '">'));

//                        console.log(linksArray.length);
                        linksArray.push(singleBookmarkObject);
                    }

//                    console.log(linksArray.length);

                    bookmarks[title] = linksArray;

    //                console.log("title " + title);
    //                console.log(linksArray.length);
    //                console.log(bookmarks);
    //                console.log(temp);

                    html = html.substring(stopIndex);
                    counter += 1;
    //                console.log("counter " + counter);
                }

                // console.log(bookmarks);
                sendDataToTheServer('php/writeBookmarks.php', {"bookmarks" : bookmarks},
                                    sendDataToTheServerCallback);
            },


            readJsonFileCallback = function (httpRequestProgressEvent) {
                var xhr = httpRequestProgressEvent.currentTarget;
                
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

//                        console.log("get html ok");

//                        parseHtml(xhr.responseText);
                        
                        crawlHtml(xhr.responseText, "<DT>");

                        // try {
                           // console.log(xhr.responseText);
                        // } catch (error) {
                            // console.log(error);
                        // }


                    } else {
                        console.log("xhr.status === 200 ERROR");
                    }
                }
            
            },
            
            readJsonFile = function (file) {
                var xhr;
                try {
                    xhr = new XMLHttpRequest();
                } catch (e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (xhr === null) {
                    alert("Ajax not supported by your browser!");
                    return;
                }
                xhr.open('GET', file, true);
                xhr.onreadystatechange = readJsonFileCallback;
                xhr.send(null);

            },

            // **********************************
            // CONSTRUCTURE
            // **********************************
            init = (function () {
//                console.log("init");

                // readJsonFile("data/bookmarks_07_03_14.html");
               readJsonFile("data/delicious.html");
                
            }()),

            last = "last";


        // ***************************
        // LISTENERS
        // ***************************


        // ***************************
        // public API
        // ***************************
        return {
            last : last
        };

    }());

    global.Bookmarks = Bookmarks;

}(this));

