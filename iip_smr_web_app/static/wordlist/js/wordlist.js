var bolded = false

$(window).load(function() {
	langSelect($('#language').find(":selected").val())
});


function alphaClick(event) {
	const letter = $(event.target).html()
	findAndScroll(letter)
}

function findAndScroll(letter) {
	var table = document.getElementById("latin-pos-table");
	var scrollTop = window.scrollY;
	for (var r = 0, row; row = table.rows[r]; r++) {
		if($(row).attr('class').includes("level0")) {
			const textContent = $(row).find("b").text().trim();
			const normalizedText = normalizeText(textContent);
			if (normalizedText[0] == letter) {
			    offset = row.getBoundingClientRect().top + scrollTop - 100;
			    window.scrollTo({
			    	top: offset
			    });
			    return;
	        }
		}
	}
}

function normalizeText(text) {
    return text.normalize('NFD');
}

function posFilter() {
	checked = new Set()
	$(".pos-filter").each(function(i, obj) {
		if(obj.checked) {
			checked.add(obj.value)
		}
	})
	const noCheck = checked.size == 0
	var table = document.getElementById("latin-pos-table")
	var hiding = false
	for(var r = 0, row; row = table.rows[r]; r++) {
		if($(row).attr('class').includes("level0")) {
			const rowHTML = row.innerHTML
			const ind = rowHTML.indexOf("</b>")
			const pos = rowHTML.substring(ind + 5, rowHTML.indexOf(" ", ind + 6))
			if(noCheck || checked.has(pos)) {
				$(row).show()
				hiding = false
			} else {
				$(row).hide()
				hiding = true
			}
		} else if (hiding) {
			$(row).hide()
		}
	}
}

function langSelect(option) {
	if(option != "")
		window.location.href = base_url + option
}

function requestLang(lang) {

	requrl = ""

	if(lang == "Latinold") {
		requrl = latin_old
	} else if (lang == "Latinnew") {
		requrl = latin_new
	}

	console.log(requrl)

	$.ajax({
		url: requrl,
		type: 'get',
		success: function(data) {
			$("#latin-table").html(data)
			$("#latin-table").show()
			boldKWIC()
		},
		failure: function(data) {
			console.log("failure")
		}
	});
}

function collapseToggle(obj) {
	var button = $(obj)
	const togclass = "." + button.attr('id').substring(3)
	if(button.html() == "+") {
		button.html("-")
		$(togclass).show()
	} else {
		button.html("+")
		$(togclass).hide()
	}
}

function treeClick(obj, counter) {
	if(obj.indexOf(" | ") > -1) {
		obj = obj.replace(" | ", "|")
	}
	dbtreerow = $("#doubletreerow")
	if(dbtreerow.length > 0 && currRt == obj) {
		dbtreerow.remove();
	} else {
		dbtreerow.remove();
		const togclass = "." + "tog" + counter;
		$(togclass).last().after('<tr id="doubletreerow"><td colspan="2"><div id="doubletree"></div></td></tr>')
		drawDT(treeData, obj);
	}
}
