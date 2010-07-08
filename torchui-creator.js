

(function($) {

	var defaults = {
		navId : "torchui-creator-nav"
	}

	var elements = { "Basic" : [
		{ 	menuTitle : "Basic Link",
			menuDescription : "This provides an anchor tag that has no styleing",
			dropMenu : function() {
				return $('<div />').html('<h3>Please complete the form</h3><form action="#"><fieldset><legend>Basic Link Creation</legend><ol><li><label for="anchor_url">Path/URL</label><input type="text" id="anchor_url" /></li><li><label for="anchor_text">Link Text</label><input type="text" value="BASIC LINK" id="anchor_text" /></li></ol></fieldset></form>'); 
			},
			dropAction : function(elem, menu) {
				var newAnchor = $("<a />").text("BASIC LINK").attr("href","#").dblclick(function() {
					$(menu).dialog("open");
				});
				$(menu).dialog({ autoOpen:false,width:500,title: "Basic Link Creation",buttons : {
					"Continue" : function() {
						$(newAnchor).text($(this).find("input#anchor_text").val()).attr("href", $(this).find("input#anchor_rul").val());
						$(this).dialog("close");
					},
					"Delete" : function() {
						$(newAnchor).remove();
						$(this).dialog("close");
						$(this).remove();
					}
				}});
				$(elem).append(newAnchor);
				$(menu).dialog("open");
			},
			helper : function() {
				return $("<a href='#'>New Link</a>");
			}},
		{ 	menuTitle : "Page Header",
			menuDescription : "This is the largest title that should be on any page",
			dropAction : function(elem) { 
				$(elem).append($("<h1 />").html(prompt("Please enter the header text","PAGE TITLE")));} },
		{	menuTitle : "Section Header",
			menuDescription : "This is the second largest title, meant for sections of content",
			dropAction : function(elem) { 
				$(elem).append($("<h2 />").html(prompt("Please enter the header text","SECTION HEADER")));} },
		{	menuTitle : "Content Header",
			menuDescription : "This is a title that is found just above a paragraph of information",
			dropAction : function(elem) { 
				$(elem).append($("<h3 />").html(prompt("Please enter the header text","CONTENT HEADER")));} },
		{	menuTitle : "Paragraph Text",
			menuDescription : "This is basic paragraph text",
			dropMenu : function() {
				return $('<div />').html('<h3>Please complete the form</h3><form action="#"><fieldset><ol><li><label for="paragraph_text">Paragraph Text</label><textarea id="paragraph_text">The quick brown fox jumps over the lazy dog.</textarea></li></ol></fieldset></form>'); 
			},
			dropAction : function(elem, menu) { 
				var newParagraph = $("<p />")
					.text("The quick brown fox jumps over the lazy dog.")
					.dblclick(function() {
						$(menu).dialog("open");
					})
					.resizable({disabled:true,grid:[80,5], containment : 'parent'})
					.hover(
						function(){ $(this).addClass("ui-widget-content").resizable("option","disabled",false);},
						function() {$(this).removeClass("ui-widget-content").resizable("option","disabled",true);});
						
				$(menu).dialog({ autoOpen:false,width:500,title: "Basic Paragraph Creation",buttons : {
					"Continue" : function() {
						$(newParagraph).resizable("destroy")
							.html($(this).find("textarea#paragraph_text").val())
							.resizable({disabled:true,grid:[80,5], containment : 'parent'});
								
						$(this).dialog("close");
					},
					"Delete" : function() {
						$(newParagraph).remove();
						$(this).dialog("close");
						$(this).remove();
					}
				}});
				$(elem).append(newParagraph);
				$(menu).dialog("open");}
			
			}
		],
		"Member Portal" : [
		{	menuTitle : "Paragraph Text",
			dropAction : function(elem) { 
				$(elem).append($("<p />").html(prompt("Please enter paragraph text","The quick brown fox jumps over the lazy dog.")));} }
		]};
		
	
	$.extend($.torchui, {
		creator : {
			settings  : {
				navId : "",
				helper : "clone"
			},
			init : function() {
				console.log("Initializing Creator");
				/* get the defaults, apply the settings */
				this.settings = $.extend({}, this.settings, defaults);
				
				/* Check for the menu, if no menu, create it */
				if($("#"+this.settings.navId).length < 1) {
					this.createMenu();
				}
				
				
				$(".drop-section").droppable({ 
					activeClass : "drop-section-active",
					drop: function(event,ui) { 
						$(ui.draggable).trigger("dropAction", this);
					}
				}).sortable();
			}, 
			createMenu : function() {
				var menuWrapper = $("<header />").attr("id", this.settings.navId).addClass("container");
				var menu = $("<div />").addClass("grid_10 prefix_1 suffix_1").appendTo(menuWrapper);
				$("<h3 />").text("TorchUI Creator").appendTo(menu);
				this.createBasicList(menu);
				this.createMemberList(menu);
				$("body").prepend(menuWrapper);
			},
			createElements : function(type, container) {
				for(element in elements[type]) {
					var dropAction = elements[type][element].dropAction;
					var dropMenu = elements[type][element].dropMenu;
					$("<li />")
						.addClass("grid_2 alpha omega")
						.append($("<span />").text(elements[type][element].menuTitle))
						.append($("<span />").addClass("description").text(elements[type][element].menuDescription))
						.draggable({ revert: true,opacity: 0.7, helper: (elements[type][element].helper || this.settings.helper )})
						.bind("dropAction", { action : dropAction, menu : dropMenu }, function(event, drop) { event.data.action(drop, event.data.menu())})
						.appendTo(container);
				}
				
				$(container).after($("<div />").addClass("clear"));
			},
			createBasicList : function(container) {
				var basicContainer = $("<div />").html($("<h4 />").text("Basic Items").click(function() {
					$(this).next("ul").toggle("slow");
				})).appendTo(container);
				var listContainer = $("<ul />").appendTo(basicContainer);
				this.createElements("Basic", listContainer);
			},
			createMemberList : function(container) {
				var basicContainer = $("<div />").html($("<h4 />").text("Member Portal Items").click(function() {
					$(this).next("ul").toggle("slow");
				})).appendTo(container);
				var listContainer = $("<ul />").appendTo(basicContainer).hide();
				this.createElements("Member Portal", listContainer);
			}
		}	
	});
	
	$(document).ready(function() {
		$.torchui.creator.init();
	});
})(jQuery);