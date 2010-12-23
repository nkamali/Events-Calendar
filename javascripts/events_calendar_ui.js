// Add Event Elements to DOM. Each Event Element has its own properties
// 	<div class="event">
// 		<div class="event_inner">
// 			<h2>Sample Item</h2>
// 			<p>Sample Location</p>
// 		</div>
//    ...
//  </div>
function addEventElementsToDom(events)
{	
	// Finds the element with id content_inner. content_inner is a div
	var content_inner_div = $("#content_inner");
	
	for(var i = 0; i < events.length; i++)
	{
		var event = events[i];

		// Sets the properties of the event div
		var cssObj = {
			'width' : event.width + "px", 
			'left'	: event.left+10 + "px",
			'height': event.length-2 + "px", /* 2px is subtracted from height since each event has a 1px top and 1px bottom border */
			'top'		: event.top + "px"
		}
		
		// <div class="event">
		$event_div = $("<div>").addClass("event");
		$event_div.css(cssObj);
		
		// <div class="event_inner">
		$event_inner_div =$("<div>").addClass("event_inner");
		
		// <h2>Sample Item</h2>		
		$h2 = $("<h2>" + event.item + "</h2>");
		
		// <p>Sample Description</p>
		$p  = $("<p>" + event.location + "</p>");
	
		// adds to h2 and p as children of event_inner
		$event_inner_div.append($h2);
		$event_inner_div.append($p);
		
		// adds event_inner div as child of event div
		$event_div.append($event_inner_div);
		
		// adds event div as child of content_inner div
		content_inner_div.append($event_div);
	}
}