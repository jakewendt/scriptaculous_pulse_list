/*

	Jake Wendt, 2007

*/
Effect.PulseList = Class.create();
Object.extend(Object.extend(Effect.PulseList.prototype, Effect.Base.prototype), {
	initialize: function(element) {
		this.element = $(element);
		if(!this.element) throw(Effect._elementDoesNotExistError);
		if( ! ['UL','OL'].include(this.element.tagName) )
			throw(Effect._elementIsNotAListError);
		if ( ! this.element.effectOn ) {
			this.element.effectOn = true;
			var options = Object.extend({
				_pulse: 1,
				direction: "down",		// up or down
				pulses: 1,
				continuous: false,
				bounce: false,
				duration: 2,
				min_opacity: 0.1
			}, arguments[1] || {});
			this.start(options);
		}
	},
	setup: function() {
		var num_items = this.element.immediateDescendants().size();
		var i = 1;
		var self = this;
		this.element.immediateDescendants().each( function(myitem){
			var mydelay = (self.options.direction == "down" ) 
				? (i++ - 1)/num_items
				: (num_items - i++)/num_items;
			var reverser   = function(pos){ return Effect.Transitions.sinoidal(1-Effect.Transitions.pulse(pos, 1)) }
			new Effect.Opacity(myitem, 
				Object.extend(Object.extend({
					delay: mydelay, 
					duration: self.options.duration, 
					from: self.options.min_opacity,
					afterFinishInternal: function(effect) {
						if ( ! ( self.options.direction == 'down' ? myitem.next() : myitem.previous() ) ) {
							if ( ( self.options.continuous ) || ( self.options._pulse++ < self.options.pulses ) ){
								if ( self.options.bounce) 
									self.options.direction = ( self.options.direction == 'up' ) ? 'down' : 'up';
								new Effect.PulseList(effect.element.parentNode, self.options || {} );
							}
						}
					}
				}, {}), {transition: reverser})
			);
		});
	},
	finish: function() {
		this.element.effectOn = false;
	}
});
