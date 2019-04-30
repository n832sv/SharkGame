sharkgame.text = {



	resource_category_dispose_messages: {
		"Special": 		[ "What have you done?" ],
		"Sharks": 		[ "Goodbye" ],
		"Cephalopods":	[ "Goodbye" ],
		"Crustaceans":	[ "Goodbye" ],
		"Cetaceans":	[ "Goodbye" ],
		"Batoidea":		[ "Goodbye" ],
		"Medusozoa":	[ "Goodbye" ],
		"Molluscs":		[ "Goodbye" ],
		"Porifera":		[ "Goodbye" ],
		"Algae":		[ "Goodbye" ],
		"Machines":		[ "Goodbye" ],
		"Science":		[ "A thousand sharkhours down the drain" ],
		"Animals":		[ "Goodbye" ],
		"Raw":			[ "Let's hope we don't regret it." ],
		"Materials":	[ "Let's hope we don't regret it." ],
		"Harmful":		[ "Oh, you'd like that, wouldn't you." ],
	},



    extra_messages: [
        // FIRST RUN
        {
            message: "&nbsp<br>&nbsp"
        },
        {
            unlock: {resource: {fish: 5}},
            message: "You attract the attention of a shark. Maybe they can help you catch fish!<br>&nbsp"
        },
        {
            unlock: {resource: {shark: 1}},
            message: "More sharks swim over, curious and watchful.<br>&nbsp"
        },
        {
            unlock: {resource: {fish: 15}},
            message: "Some rays drift over.<br>&nbsp"
        },
        {
            unlock: {resource: {shark: 1, ray: 1}},
            message: "You have quite the group going now.<br>&nbsp"
        },
        {
            unlock: {resource: {shark: 4, ray: 4}},
            message: "Some curious crabs come over.<br>&nbsp"
        },
        {
            unlock: {resource: {shark: 1, ray: 1, crab: 1}},
            message: "Your new tribe is at your command!<br>&nbsp"
        },
        {
            unlock: {resource: {shark: 1, crystal: 10}},
            message: "The crystals are shiny. Some sharks stare at them curiously.<br>&nbsp"
        },
        {
            unlock: {resource: {scientist: 1}},
            message: "The science sharks swim in their own school.<br>&nbsp"
        },
        {
            unlock: {upgrade: ["crystalContainer"]},
            message: "More discoveries are needed.<br>&nbsp"
        },
        {
            unlock: {resource: {nurse: 1}},
            message: "The shark community grows with time.<br>&nbsp"
        },
        {
            unlock: {upgrade: ["exploration"]},
            message: "You hear faint songs and cries in the distance.<br>&nbsp"
        },
        {
            unlock: {upgrade: ["automation"]},
            message: "Machines to do things for you.<br>Machines to do things faster than you or any shark."
        },
        {
            unlock: {upgrade: ["farExploration"]},
            message: "This place is not your home. You remember a crystal blue ocean.<br>The chasms beckon."
        },
        {
            unlock: {upgrade: ["gateDiscovery"]},
            message: "The gate beckons. The secret must be unlocked.<br>&nbsp"
        },
        // LATER RUNS
        // INITIAL WORLD STATUSES
        {
            unlock: {world: "chaotic"},
            message: "Overwhelming reinforcements. Overwhelming everything. So hard to focus.<br>&nbsp"
        },
        {
            unlock: {world: "haven"},
            message: "The oceans are rich with life. But it's still not home.<br>&nbsp"
        },
        {
            unlock: {world: "marine"},
            message: "The fish never run dry here. This place feels so familiar.<br>&nbsp"
        },
        {
            unlock: {world: "tempestuous"},
            message: "The storm never ends, and many are lost to its violent throes.<br>&nbsp"
        },
        {
            unlock: {world: "violent"},
            message: "Bursts of plenty from the scorching vents, but so hot.<br>No place for the young."
        },
        {
            unlock: {world: "abandoned"},
            message: "The tar clogs the gills of everyone here.<br>This dying world drags everyone down with it."
        },
        {
            unlock: {world: "shrouded"},
            message: "The crystals are easier to find, but the darkness makes it hard to find anything else.<br>&nbsp"
        },
        {
            unlock: {world: "frigid"},
            message: "So cold. The food supplies freeze quickly here. Too hard to chew.<br>&nbsp"
        },
        // BANKED ESSENCE
        {
            unlock: {resource: {essence: 10}},
            message: "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else."
        },
        // NEW ANIMALS
        {
            unlock: {resource: {shrimp: 50}},
            message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives."
        },
        {
            unlock: {resource: {lobster: 20}},
            message: "The lobsters work, but seem carefree.<br>They worry about nothing."
        },
        {
            unlock: {resource: {eel: 10}},
            message: "The eels chatter among their hiding places.<br>They like the sharks."
        },
        {
            unlock: {resource: {dolphin: 5}},
            message: "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile."
        },
        {
            unlock: {resource: {octopus: 8}},
            message: "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes."
        },
        {
            unlock: {resource: {whale: 1}},
            message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?"
        },
        {
            unlock: {resource: {chimaera: 5}},
            message: "The chimaeras are ancient kin of the shark kind, reunited through wild coincidence.<br>What peerless wonders have they found in the dark?"
        },
        // UNIQUE STATUSES
        {
            unlock: {resource: {chorus: 1}},
            message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp"
        },
        // DANGER STATUSES
        {
            unlock: {world: "abandoned", resource: {tar: 20}},
            message: "The tar is killing everything!<br>Maybe a machine can save us?"
        },
        {
            unlock: {world: "abandoned", resource: {tar: 200}},
            message: "Only machines will remain. All is lost.<br><span class='smallDesc'>All is lost.</span>"
        },
        {
            unlock: {world: "frigid", resource: {ice: 50}},
            message: "Something has to be done before the ice destroys us all!<br>Maybe a machine can save us?"
        },
        {
            unlock: {world: "frigid", resource: {ice: 200}},
            message: "So cold. So hungry.<br><span class='smallDesc'>So hopeless.</span>"
        }
    ],



	action_messages: {
		"Catch fish": {
			outcomes: [
		        "Dropped the bass.",
		        "Ate a kipper. Wait. Hang on.",
		        "You eat a fish hooray!",
		        "Fish.",
		        "Ate a shark. Wait. No, it wasn't a shark.",
		        "Ate an anchovy.",
		        "Ate a catfish.",
		        "Ate a flounder.",
		        "Ate a haddock.",
		        "Ate a herring.",
		        "Ate a mackerel.",
		        "Ate a mullet.",
		        "Ate a perch.",
		        "Ate a pollock.",
		        "Ate a salmon.",
		        "Ate a sardine.",
		        "Ate a sole.",
		        "Ate a tilapia.",
		        "Ate a trout.",
		        "Ate a whitefish.",
		        "Ate a bass.",
		        "Ate a carp.",
		        "Ate a cod.",
		        "Ate a halibut.",
		        "Ate a mahi mahi.",
		        "Ate a monkfish.",
		        "Ate a perch.",
		        "Ate a snapper.",
		        "Ate a bluefish.",
		        "Ate a grouper.",
		        "Ate a sea bass.",
		        "Ate a yellowfin tuna.",
		        "Ate a marlin.",
		        "Ate an orange roughy.",
		        "Ate a shark.",
		        "Ate a swordfish.",
		        "Ate a tilefish.",
		        "Ate a tuna."
			],
			multioutcomes: []
        }

	}
};
