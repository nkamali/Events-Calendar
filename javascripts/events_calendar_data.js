// The default width of one event, assuming there are no collisions with other events.
// If there collisions, the width of each event which collides is divided equally by 
// the number of events which collide.
var total_width_of_event_in_px = 600;

// Initialize an Event to its default values
function initializeEventDefaults(event)
{
	if(event.collision_hash == undefined)
	{
		event.collision_hash 		= new Array();
		event.already_seen_hash = new Array();	
		event.num_collisions 	= 0;
		event.width 					= total_width_of_event_in_px;
		event.left  					= 0;
		event.top   					= event.start;
		event.length   				= event.end - event.start;
		event.left_pos_final  = false;
		
		// sets the default title and description
		if(event.item == undefined)
		{
			event.item = "Sample Item";
		}
		
		if(event.location == undefined)
		{
			event.location = "Sample Location";
		}
		
	}
}

/**
Lays out events for a single  day

@param array events  
 An array of event objects. Each event object consists of a start time, end
 Time (measured in minutes) from 9am, as well as a unique id. The
 Start and end time of each event will be [0, 720]. The start time will
 Be less than the end time. The array is not sorted.

 @return array
 An array of event objects that has the width, the left and top positions set,
 In addition to start time, end time, and id. 
**/
function layOutDay(events) 
{
	for(var i = 0; i < events.length; i++)
	{		
		// Initializes event defaults if not already initialized
		initializeEventDefaults(events[i]);
		
		for(var j = i+1; j < events.length; j++)
		{	
			if(i == j)
			{
				continue;
			}
			
			// Initializes event defaults if not already initialized
			initializeEventDefaults(events[j]);
									
			addToCollisionHashTables(events[i], events[j]);
			
		} // end of inner loop
	} // end of outer loop
		
	addUIPropertiesAndNormalizeEvents(events);
	
	// Renders the events onto the screen (This function is defined in events_calendar_ui.js)
	addEventElementsToDom(events);
	
	return events
}

// Determines if event1 and event2 collide
// If they collide, the two events will eventually have two different left positions
function doEventsCollide(event1, event2)
{
	if( ((event2.start >= event1.start) && (event2.start < event1.end) ) ||
	    ( (event1.start >= event2.start) && (event1.start < event2.end) ) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// This function takes two events and adds each other to their collision hash tables, if there's a collision
// and it already doesn't exist.
function addToCollisionHashTables(event1, event2)
{
	// If Events 1 and 2 Collide, here they will reference each other's ids
	// Events array is not necessarily sorted in any particular order
	if( doEventsCollide(event1, event2) )
	{				
		if(event1.collision_hash[event2.id.toString()] == undefined)
		{	
			event1.collision_hash[event2.id.toString()] = event2;
			event1.num_collisions++;
			
			event2.collision_hash[event1.id.toString()] = event1;
			event2.num_collisions++;			
		}				
	}
	
}

// Modifies the left and width properties of events which collide.
function normalizeCollisions(event)
{
	if(event.num_collisions >= 1)
	{	
		var key 							= null;

		// The first time the event is seen, its left property's position is set to 0.
		if(event.left_pos_final == false)
		{
			event.left = 0;
			event.left_pos_final 		= true;
		}

		var offset_multiplier = 1;
			
		// iterates through ids of the collision_hash
		for (key in event.collision_hash) 
		{
			//var potential_conflicting_event = event.collision_hash[key];
			var conflicting_event 		= event.collision_hash[key];
			new_width_for_two_events 	= total_width_of_event_in_px / (event.num_collisions + 1);
			event.width								= new_width_for_two_events;
			conflicting_event.width  	= new_width_for_two_events;
			conflicting_event.left 		= new_width_for_two_events * (offset_multiplier++);
		}
	}
}

// Adds UI Properties width and left positions to each event of the events array after 
// normalizing events' properties.
function addUIPropertiesAndNormalizeEvents(events)
{	
	for(var i = 0; i < events.length; i++)
	{
		normalizeCollisions(events[i]);
	}	
}
