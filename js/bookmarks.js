/*jslint browser:true*/
/*global console:true,alert:true,confirm:true,forin: true,ActiveXObject:true,FormData:true,Handlebars:true,
Spinner:true, $:true, todayLock:true*/

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

		var NEW_BOOKMARK = 1,
			UPDATE_BOOKMARK = 2,

			bookmarkTemplate = Handlebars.compile(document.getElementById('bookmark-template').innerHTML),
			bookmarksContent = document.getElementById("bookmarks-content"),
			spinner = new Spinner({
				// color : "#D8D8D8",
				shadow : true,
				radius : 40,
				speed: 2
			}),
            spinnerDiv = document.getElementById("spinner"),
            input = document.getElementById('input'),
            jsonBookmarksArrayResponse,
            filteredBookmarks,

            updateNameInput = document.getElementById('update-name'),
            updateLinkInput = document.getElementById('update-link'),
            updateTagsInput = document.getElementById('update-tags'),
            updateNoteInput = document.getElementById('update-note'),
            updateIdInput = document.getElementById('update-id'),

            bookmarkStep = 50,
            firstBookmark = 0,
            lastBookmark = firstBookmark + bookmarkStep,

            firstBookmarkLabel = document.getElementById('first-bookmark'),
            lastBookmarkLabel = document.getElementById('last-bookmark'),
            totalBookmarksLabel = document.getElementById('total-bookmarks'),

            paginationButtons = document.getElementById('pagination-buttons'),
            firstButton = document.getElementById("first-button"),
            previousButton = document.getElementById("previous-button"),
			nextButton = document.getElementById("next-button"),

			alertBox = document.getElementById("alert"),
			alertBoxContent = document.getElementById("alert-content"),

			formName = document.getElementById("formName"),
		    formLink = document.getElementById("formLink"),
			// formTags = document.getElementById("formTags"),
			selectizeTags,
			formNote = document.getElementById("formNote"),
			returnListenerBool = false,
			withInputResponseToReturn = 0,

			keyCharMap = {
				"65" : "a",
				"66" : "b",
				"67" : "c",
				"68" : "d",
				"69" : "e",
				"70" : "f",
				"71" : "g",
				"72" : "h",
				"73" : "i",
				"74" : "j",
				"75" : "k",
				"76" : "l",
				"77" : "m",
				"78" : "n",
				"79" : "o",
				"80" : "p",
				"81" : "q",
				"82" : "r",
				"83" : "s",
				"84" : "t",
				"85" : "u",
				"86" : "v",
				"87" : "w",
				"88" : "x",
				"89" : "y",
				"90" : "z"
			},

			getTodayYMD = function () {
				var date = new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDay(),
                    out = '';

				month += 1;
				if (month < 10) {
					month = "0" + month;
				}
				day += 1;
				if (day < 10) {
					day = "0" + day;
				}
                out += year + month + day;
				return out;

			},

            startLoading = function () {
                spinner.spin(spinnerDiv);
                document.body.classList.add('loading');
            },

            stopLoading = function () {
                spinner.stop();
                document.body.classList.remove('loading');
            },

            talkToTheServer = function (serverScriptUrl, dataObject, callback) {
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

			deleteBockmarkCallback = function (httpRequestProgressEvent) {
				var xhr = httpRequestProgressEvent.currentTarget,
					i,
					len,
					response,
					bookmarksOnThePage,
					removedId;

				if (xhr.readyState === 4) {
					if (xhr.status === 200) {

						// console.log(xhr.responseText);

						response = JSON.parse(xhr.responseText);
						// console.log(response);
						removedId = parseInt(response.idDeleted);

						// this for might crasch while deleting the last bookmarks
						for (i = 0, len = (filteredBookmarks.length); i < len; i += 1) {
							if (filteredBookmarks[i].id == removedId) {
								filteredBookmarks.splice(i, 1);
								break;
							}
						}
						// transition.perspectiveLeftOut
						// transition.slideLeftBigOut
						// $("#bookmark-"+removedId).velocity("transition.perspectiveLeftOut", { stagger: 500 });
						$("#bookmark-"+removedId).velocity("transition.perspectiveLeftOut");

						setTimeout(function () {
							// console.log(filteredBookmarks.length);
							bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);
							displayBookmarks(bookmarksOnThePage);
							$(".bookmark-container").velocity("transition.slideUpIn");
						}, 400);

						// bookmarksContent.removeChild(document.getElementById('bookmark-' + response.idDeleted));

						alertBoxContent.innerHTML = 'Bookmark succesfully removed';
						alertBox.className = 'alert-box right success show';
						setTimeout(function () {
							alertBox.className = 'hide';
						}, 1000);


					} else {
						console.log("xhr.status === 200 ERROR");
						alertBoxContent.innerHTML = 'ERROR removing a bookmark';
						alertBox.className = 'alert-box right alert show';
					}
					stopLoading();
				}


			},

			updateBockmarkCallback = function (httpRequestProgressEvent) {
				var xhr = httpRequestProgressEvent.currentTarget,
					response,
					id,
					i,
					len,
					updateBookmark,
					bookmarksOnThePage;

					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
						// console.log(xhr.responseText);
						response = JSON.parse(xhr.responseText);

						updateBookmark = response.bookmark;
						// console.log(updateBookmark);

						id = updateBookmark.id;

						// console.log(filteredBookmarks);
						for (i = 0, len = filteredBookmarks.length ; i < len; i += 1) {
							if (filteredBookmarks[i].id == id) {
								filteredBookmarks[i] = updateBookmark;
							}
						}
						bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);
						displayBookmarks(bookmarksOnThePage);

						alertBoxContent.innerHTML = 'Bookmark succesfully UPDATED';
						alertBox.className = 'alert-box right success show';
						setTimeout(function () {
								alertBox.className = 'hide';
						}, 1000);

					} else {
						// console.log("xhr.status === 200 ERROR");
						alertBoxContent.innerHTML = 'ERROR UPDATING a bookmark';
						alertBox.className = 'alert-box right alert show';
					}
					stopLoading();
				}
				$('#update-modal').foundation('reveal', 'close');

			},

			unlockerCallback = function (httpRequestProgressEvent) {

				var xhr = httpRequestProgressEvent.currentTarget,
					response;

				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						// console.log(xhr.responseText);
						response = JSON.parse(xhr.responseText);
						if (response.locker === 'ok') {
							$('#unlocker-modal').foundation('reveal', 'close');
							document.body.removeEventListener('keypress', keyPressListener);
							// window.location.reload();
						}
					} else {
						console.log("xhr.status === 200 ERROR");
					}
				}
				// reset the input fields
				document.getElementById('unlocker-name').value = null;
				document.getElementById('unlocker-pass').value = null;
				input.value = null;
				// hide the keyboard on iPad
				$("#unlocker-pass").blur();
				$("#input").blur();

			},

			returnCallBack = function (event) {

				if (event.keyCode === 13) {
					event.preventDefault();
					if ( withInputResponseToReturn=== NEW_BOOKMARK) {
						// console.log("NEW_BOOKMARK");
						newBookmarkListener();
					} else if (withInputResponseToReturn === UPDATE_BOOKMARK ) {
						updateBookmarkListener();
					}
				}

			} ,

			newBookmarkListener = function () {

			    // var nerdTooltip = new ZTooltip("newBookmarkButton", "left", "newBookmarkButton");
			    // nerdTooltip.toggle();

				var link = formLink.value,
					obj;
				if (link) {
					try {
						startLoading();
						obj = {
							"name" : formName.value,
							"link" : link,
							"tags" : selectizeTags.getValue().toString(),
							"note" : formNote.value
						};
						talkToTheServer('php/newBookmark.php', obj, newBookmarkCallback);
						withInputResponseToReturn = 0;
					}
					catch (e) {
						alert("new bookmark catch message: " + e);
					}
				} else {
					document.removeEventListener('keypress', returnCallBack);
					returnListenerBool= false;
					alert('link can not be empty');
				}
			},

			updateBookmarkListener = function () {

				if (updateLinkInput.value) {
					startLoading();
					var obj = {
						"name_value": updateNameInput.value,
						"link_value": updateLinkInput.value,
						"tags_value": updateTagsInput.value,
						"note_value": updateNoteInput.value,
						"id_value": updateIdInput.value
					};
					talkToTheServer('php/updateBookmark.php', obj, updateBockmarkCallback);
					withInputResponseToReturn = 0;
				} else {
					document.removeEventListener('keypress', returnCallBack);
					returnListenerBool= false;
					alert('link can not be empty');
				}

			},

			submitInputListener = function () {

				if (formName.value || formLink.value || formNote.value) {
					if (!returnListenerBool) {
						document.addEventListener('keypress', returnCallBack);
						returnListenerBool = true;
					}

				}
				else {
					document.removeEventListener('keypress', returnCallBack);
					returnListenerBool= false;
				}

			},

			updateInputListener = function () {

				if (updateNameInput.value || updateLinkInput.value || updateTagsInput.value || updateNoteInput.value) {
					if (!returnListenerBool) {
						document.addEventListener('keypress', returnCallBack);
						returnListenerBool = true;
					}

				}
				else {
					document.removeEventListener('keypress', returnCallBack);
					returnListenerBool= false;
				}
			},

			updateButtonClickListener = function (event) {

                updateNameInput.value = document.getElementById("name-" + this.id).innerHTML;
                updateLinkInput.value = document.getElementById("link-" + this.id).innerHTML;
                updateTagsInput.value = document.getElementById("tags-" + this.id).innerHTML;
                updateNoteInput.value = document.getElementById("note-" + this.id).innerHTML;
                updateIdInput.value = this.id;


                $('#update-modal').foundation('reveal', 'open');

			},

			delButtonClickListener = function (event) {
				// console.log(this.id);
				if (confirm("Are you sure?")) {
					try {
						startLoading();
						var obj = {"id": this.id};
						talkToTheServer('php/deleteBookmark.php', obj, deleteBockmarkCallback);
					}
					catch (e) {
						alert("catch message: " + e);
					}
				}
			},

			pdoStudyCallback = function (httpRequestProgressEvent) {
                var xhr = httpRequestProgressEvent.currentTarget,
                    bookmarksHtml = "",
                    i,
                    len,
                    delButtonsArray;

                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        console.log(xhr.responseText);

                        // jsonBookmarksArrayResponse = JSON.parse(xhr.responseText).bookmarks;
                        // console.log(jsonBookmarksArrayResponse);

                    } else {
                        console.log("xhr.status === 200 ERROR");
                    }
                }
            },

            getBookmarksOnThePage = function (bookmarks) {

				if (bookmarks.length <= bookmarkStep) {
					paginationButtons.className = 'button-group right round hide';
				} else {
					paginationButtons.className = 'button-group right round';
				}
				if (firstBookmark === 0) {
					firstButton.className = 'button small secondary disabled';
					previousButton.className = 'button small secondary disabled';
				} else {
					firstButton.className = 'button small secondary';
					previousButton.className = 'button small secondary';
				}
				// if ((bookmarks.length - lastBookmark) <= bookmarkStep) {
				if (bookmarks.length <= lastBookmark) {
					nextButton.className = 'button small secondary disabled';
				} else {
					nextButton.className = 'button small secondary';
				}

                firstBookmarkLabel.innerHTML = firstBookmark;
                lastBookmarkLabel.innerHTML = lastBookmark;
                totalBookmarksLabel.innerHTML = bookmarks.length;

                return bookmarks.slice(firstBookmark, lastBookmark);

            },

            displayBookmarks = function (bookmarks) {

                // reset the screen
                bookmarksContent.innerHTML = "";

                var i, len = 0,
                    bookmarksHtml = "",
                    updateButtonsArray,
                    delButtonsArray,
                    data;

                for (i = 0, len = bookmarks.length; i < len; i += 1) {
                    data = bookmarks[i];
                    bookmarksHtml += bookmarkTemplate(data);
                }
                bookmarksContent.innerHTML = bookmarksHtml;
                // document.getElementById('bookmarks-counter').innerHTML = "bookmarks counter: " + len;


                updateButtonsArray = document.getElementsByClassName('update-button');
                for (i = 0, len = updateButtonsArray.length; i < len; i += 1) {
                    updateButtonsArray[i].onclick = updateButtonClickListener;
                }

                delButtonsArray = document.getElementsByClassName('del-button');
                for (i = 0, len = delButtonsArray.length; i < len; i += 1) {
                    delButtonsArray[i].onclick = delButtonClickListener;
                }


            },

            getBookmarksCallback = function (httpRequestProgressEvent) {
                var xhr = httpRequestProgressEvent.currentTarget,
                    response,
                    bookmarksOnThePage;

                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        // console.log(xhr.responseText);

                        response = JSON.parse(xhr.responseText);
                        // console.log(response);

                        jsonBookmarksArrayResponse = response.bookmarks;
                        // document.getElementById("number-of-tags").innerHTML = response.tags.length;

                        document.getElementById("formTags").innerHTML = response.selectOptions;
                        selectizeTags = $('#formTags').selectize({// +++
                            create : true,
                            openOnFocus : false,
                            hideSelected : true
                        })[0].selectize;


                        document.getElementById("tags-select").innerHTML = response.selectOptions;



                        // *********************************************************
                        // START CHOOSEN
                        // *********************************************************
                        // $(".chosen-select").chosen({
                            // inherit_select_classes : true,
                            // placeholder_text_multiple : response.tags.length + " tags",
                            // width: "100%"
                        // }).change(function(obj, event) {
                            // var tagsSelected = [],
                                // i, j, len,
                                // filteredBookmarks = [];
                            // // TODO
//
                            // if (event.selected) {
                                // tagsSelected.push(event.selected);
                            // } else {
                                // tagsSelected.splice(tagsSelected.indexOf(event.deselected, 1));
                            // }
//
                            // if (tagsSelected) {
                                // for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
                                    // for (j = 0; j < tagsSelected.length; j += 1) {
                                        // if (jsonBookmarksArrayResponse[i].tags.toLowerCase().indexOf(tagsSelected[j]) !== -1) {
                                            // filteredBookmarks.push(jsonBookmarksArrayResponse[i]);
                                        // }
                                    // }
                                // }
                            // } else {
                                // filteredBookmarks = jsonBookmarksArrayResponse;
                            // }

                            // displayBookmarks(getBookmarksOnThePage(filteredBookmarks));
                            // totalBookmarksLabel.innerHTML = filteredBookmarks.length;
//
                        // });
                        // hask to have the 2 input field with the same height
                        // document.getElementsByClassName("default")[0].style.height = window.getComputedStyle(input).height;
                        // document.getElementsByClassName("default")[0].style.height = "100%";
                        // *********************************************************
                        // STOP CHOOSEN
                        // *********************************************************


                        filteredBookmarks = jsonBookmarksArrayResponse;//.slice(0, 100);

                        bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);

                        displayBookmarks(bookmarksOnThePage);


                        stopLoading();

                        $('#page-content').velocity({
						    opacity: 1
						}, {
						    /* Velocity's default options: */
						    duration: 1000,
						    // easing: "easeOutQuint",
						    complete: null,
						    delay: null,
						    mobileHA: true
						});

                    } else {
                        console.log("xhr.status === 200 ERROR");
                    }
                }

            },

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



			newBookmarkCallback = function (httpRequestProgressEvent) {

				var xhr = httpRequestProgressEvent.currentTarget,
					newBookmark,
					bookmarksOnThePage;

				if (xhr.readyState === 4) {
					if (xhr.status === 200) {

						// console.log(xhr.responseText);

						newBookmark = JSON.parse(xhr.responseText).bookmark;
						console.log(newBookmark);
						// console.log(filteredBookmarks.length);
						filteredBookmarks.unshift(newBookmark);
						// console.log(filteredBookmarks.length);
						bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);
						displayBookmarks(bookmarksOnThePage);

						$("#bookmark-"+newBookmark.id).velocity("transition.bounceLeftIn", { stagger: 100 });
						// $(".bookmark-container").velocity("callout.shake", { stagger: 75 });

						formName.value = null;
						formLink.value = null;
						// formTags.value = null;
						selectizeTags.setValue("");
						formNote.value = null;

						alertBoxContent.innerHTML = 'Bookmark succesfully added';
						alertBox.className = 'alert-box right success show';
						setTimeout(function () {
							alertBox.className = 'hide';
						}, 1000);

					} else {
						console.log("xhr.status === 200 ERROR");
						alertBoxContent.innerHTML = 'ERROR adding a bookmark';
						alertBox.className = 'alert-box right alert show';
					}
					stopLoading();
				}
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

                console.log(bookmarks);
                // this write all the bookmarks in mysql
                talkToTheServer('php/writeBookmarks.php', {"bookmarks" : JSON.stringify(bookmarks)},
                                    sendDataToTheServerCallback);
            },

            getArrayFiltered = function (text) {
                var i, len, j, counter = 0, out = [], tags;

                if (text[0] === "#") {

                    tags = text.substring(1).split(" ");
                    console.log(tags);

                    for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
                        for (j = 0; j < tags.length; j += 1) {
                            if (jsonBookmarksArrayResponse[i].tags.indexOf(tags[j]) !== -1) {
                                // console.log(jsonBookmarksArrayResponse[i].id);
                                // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark hide";
                                // document.getElementById("bookmark-"+jsonBookmarksArrayResponse[i].id).classList.add('hide');
                                out.push(jsonBookmarksArrayResponse[i]);

                            } else {
                                console.log("contiene");

                                // document.getElementById("bookmark-"+jsonBookmarksArrayResponse[i].id).classList.remove('hide');
                                // counter += 1;

                            }
                        }
                    }


                } else {

                    for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
                        if (jsonBookmarksArrayResponse[i].name.indexOf(text) !== -1) {
                            // console.log(jsonBookmarksArrayResponse[i].id);
                            // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark hide";

                            // document.getElementById("bookmark-"+jsonBookmarksArrayResponse[i].id).classList.add('hide');
                            out.push(jsonBookmarksArrayResponse[i]);
                        } else {
                            console.log("contiene");
                            // console.log("name" + jsonBookmarksArrayResponse[i].name);
                            // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark show";
                            // document.getElementById("bookmark-"+jsonBookmarksArrayResponse[i].id).classList.remove('hide');
                            // counter += 1;
                        }
                    }
                }
                // console.log(counter);
                // document.getElementById('bookmarks-counter').innerHTML = "bookmarks counter: " + counter;
                return out;
            },

            filter = function (text) {
                var i, len, j, counter = 0, tags;

                if (text[0] === "#") {
                    tags = text.substring(1).split(" ");
                    console.log(tags);

                    for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
                        for (j = 0; j < tags.length; j += 1) {
                            if (jsonBookmarksArrayResponse[i].tags.indexOf(tags[j]) === -1) {
                                // console.log(jsonBookmarksArrayResponse[i].id);
                                // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark hide";
                                document.getElementById("bookmark-" + jsonBookmarksArrayResponse[i].id).classList.add('hide');

                            } else {
                                // console.log("contiene");
                                // console.log("name" + jsonBookmarksArrayResponse[i].name);
                                // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark show";
                                document.getElementById("bookmark-" + jsonBookmarksArrayResponse[i].id).classList.remove('hide');
                                counter += 1;
                            }
                        }
                    }


                } else {

                    for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
                        if (jsonBookmarksArrayResponse[i].name.indexOf(text) === -1) {
                            // console.log(jsonBookmarksArrayResponse[i].id);
                            // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark hide";

                            document.getElementById("bookmark-" + jsonBookmarksArrayResponse[i].id).classList.add('hide');
                        } else {
                            // console.log("contiene");
                            // console.log("name" + jsonBookmarksArrayResponse[i].name);
                            // document.getElementById(""+jsonBookmarksArrayResponse[i].id).parentElement.className = "bookmark show";
                            document.getElementById("bookmark-" + jsonBookmarksArrayResponse[i].id).classList.remove('hide');
                            counter += 1;
                        }
                    }

                }
                // console.log(counter);
                document.getElementById('bookmarks-counter').innerHTML = "bookmarks counter: " + counter;
            },

            filter2 = function (text) {

				filteredBookmarks = [];
				firstBookmark = 0;
				lastBookmark = firstBookmark + bookmarkStep;

				var i, len, j, tags, locker, link;

				if (text[0] === "#") { // bookmarks's tags
					tags = text.substring(1).split(" ");
					// console.log(tags);

					for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
						for (j = 0; j < tags.length; j += 1) {
							if (jsonBookmarksArrayResponse[i].tags.toLowerCase().indexOf(tags[j]) !== -1) {
								filteredBookmarks.push(jsonBookmarksArrayResponse[i]);
							}
						}
					}

				} else if (text[0] === "!") { // locker
					locker = text.substring(1).trim();
					console.log(locker);

					if (locker === "lock" || locker === "exit") {
						// console.log("pippo");
						$('#unlocker-modal').foundation('reveal', 'open');
						document.body.addEventListener('keypress', keyPressListener);
						talkToTheServer('php/locker.php', {today : 'lock'}, unlockerCallback);
					}
					else {
						console.log("noooo");
					}

				} else if (text[0] === "@") { // bookmarks's link
					link = text.substring(1);
					// console.log(link);
					for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
						if (jsonBookmarksArrayResponse[i].link.toLowerCase().indexOf(link) !== -1) {
							filteredBookmarks.push(jsonBookmarksArrayResponse[i]);
						}
					}
				} else { // bookmarks's name
					for (i = 0, len = jsonBookmarksArrayResponse.length; i < len; i += 1) {
						if (jsonBookmarksArrayResponse[i].name.toLowerCase().indexOf(text) !== -1) {
							filteredBookmarks.push(jsonBookmarksArrayResponse[i]);
						}
					}

				}

				displayBookmarks(getBookmarksOnThePage(filteredBookmarks));
				totalBookmarksLabel.innerHTML = filteredBookmarks.length;
				// stopLoading();
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


			keyPressListener = function (event) {
				// old keyup listener
				// if (event.keyCode >= 65 && event.keyCode <= 90) {
						// keyPass += keyCharMap[event.keyCode];
				// }

				console.log(event.keyCode);
				if (event.keyCode === 13) {
					// document.body.removeEventListener('keyup');

					var obj = {
						name : document.getElementById('unlocker-name').value,
						pass : document.getElementById('unlocker-pass').value,
						today : getTodayYMD()
					};
					// console.log(obj);
					talkToTheServer('php/locker.php', obj, unlockerCallback);
				}
			},

            // **********************************
            // CONSTRUCTURE
            // **********************************
			init = (function () {

				// readJsonFile("data/bookmarks_07_03_14.html");
				// readJsonFile("data/delicious.html");
				// document.getElementById("page-content").style.opacity = 0;
				startLoading();


				var obj = {"input" : input.value};

				// talkToTheServer('php/pdoStudy.php', obj, pdoStudyCallback);

				talkToTheServer('php/getBookmarks.php', obj, getBookmarksCallback);

				$(document).foundation({
					reveal : {
						close_on_background_click : false,
						close_on_esc : false
					}
				});
				// console.log(todayLock);

				if (todayLock !== getTodayYMD()) {
					// document.body.classList.add('hide');
					$('#unlocker-modal').foundation('reveal', 'open');
					document.body.addEventListener('keypress', keyPressListener);
				}

// TODO
// $('#newBookmarkButton').velocity({
    // // opacity: .1
    // // right: 800
    // translateZ: 0, // Force HA by animating a 3D property
    // rotateZ: "15deg",
     // translateX: "-800px"
// }, {
    // /* Velocity's default options: */
    // duration: 2000,
    // easing: "swing",
    // queue: "",
    // begin: null,
    // progress: function (elements, percentComplete, timeRemaining, timeStart) {
    		// // console.log(par1);
    		// // console.log(par2);
    		// // console.log(par3);
    		// // console.log(par4);
    // },
    // complete: null,
    // loop: false,
    // delay: 1000,
    // display: false,
    // mobileHA: true
// }).velocity({
    // // opacity: .1
    // top: 800
// }) ;
            }()),

            last = "last";


        // ***************************
        // LISTENERS
        // ***************************
        input.oninput = function (event) {

			// filter(this.value);
			filter2(this.value.toLowerCase());

		};

		document.getElementById("newBookmarkButton").onclick = function (event) {
			newBookmarkListener();
		};
		document.getElementById("ok-button").onclick = function (event) {
			updateBookmarkListener();
		};
		document.getElementById("cancel-button").onclick = function (event) {
			$('#update-modal').foundation('reveal', 'close');
		};

		firstButton.onclick = function (event) {

			var bookmarksOnThePage;

            firstBookmark = 0;
            lastBookmark = bookmarkStep;

            // this.classList.toggle('disabled');
            // previousButton.classList.toggle('disabled');

            bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);

            displayBookmarks(bookmarksOnThePage);

            // nextButton.classList.remove('disabled');
        };
        previousButton.onclick = function (event) {
            var bookmarksOnThePage;

            firstBookmark -= bookmarkStep;
            lastBookmark -= bookmarkStep;

            if (firstBookmark <= 0) {
                firstBookmark = 0;
                lastBookmark = bookmarkStep;
                // this.classList.add('disabled');
                // previousButton.classList.add('disabled');
            }

            bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);

            displayBookmarks(bookmarksOnThePage);

            // nextButton.classList.remove('disabled');
        };
        nextButton.onclick = function (event) {
            var bookmarksOnThePage;

            firstBookmark += bookmarkStep;
            lastBookmark += bookmarkStep;

            if (lastBookmark >= filteredBookmarks.length) {
                lastBookmark = filteredBookmarks.length;
                firstBookmark = lastBookmark - bookmarkStep;
                // nextButton.classList.add('disabled');
            }

            bookmarksOnThePage = getBookmarksOnThePage(filteredBookmarks);
            displayBookmarks(bookmarksOnThePage);

            // firstButton.classList.remove('disabled');
            // previousButton.classList.remove('disabled');
        };

		formName.oninput = function () {
			withInputResponseToReturn = NEW_BOOKMARK;
			submitInputListener();
		};
		formLink.oninput = function () {
			withInputResponseToReturn = NEW_BOOKMARK;
			submitInputListener();
		};
		// formTags.oninput = function () {
			// withInputResponseToReturn = NEW_BOOKMARK;
			// submitInputListener();
		// };
		formNote.oninput = function () {
			withInputResponseToReturn = NEW_BOOKMARK;
			submitInputListener();
		};


		updateNameInput.oninput = function () {
			withInputResponseToReturn = UPDATE_BOOKMARK;
			updateInputListener();
		};
		updateLinkInput.oninput = function () {
			withInputResponseToReturn = UPDATE_BOOKMARK;
			updateInputListener();
		};
		updateTagsInput.oninput = function () {
			withInputResponseToReturn = UPDATE_BOOKMARK;
			updateInputListener();
		};
		updateNoteInput.oninput = function () {
			withInputResponseToReturn = UPDATE_BOOKMARK;
			updateInputListener();
		};

		document.getElementById('go-to-the-top-button').onclick = function () {
			// document.body.scrollTop  = 0;
			// $('body').scrollTop(0)

			// $('<a name="top"/>').insertBefore($('body').children().eq(0));
			// window.location.hash = 'top'

			// document.body.scrollTop = document.documentElement.scrollTop = 0;

			$('#pagination-buttons').velocity("scroll", { duration: 1100});
		};

		// ***************************
		// public API
		// ***************************
		return {
			last : last
		};

	}());

	global.Bookmarks = Bookmarks;

}(this));


function unique(arr) {
    "use strict";
    var r = {};
    arr.forEach(function (e) {
        r[e] = 1;
    });
    return Object.keys(r);
}




